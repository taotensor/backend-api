import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MessagesContainer from "./MessagesContainer";
import Message from "../../../types/Message";
import InputBar from "./InputBar";
import { fetchTextMessage, generateImage, fetchConversation } from "../../../services/api";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { useParams } from "react-router-dom";

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [mode, setMode] = useState<"image" | "text">("text");
  const [inputEnabled, setInputEnabled] = useState<boolean>(true);
  const { uuid } = useParams<{ uuid: string }>(); // Extract UUID from the URL

  const handleSendMessage = (newMessage: string) => {
    setMessages((prevState) => [
      ...prevState,
      { author: "user", text: newMessage, type: "text" },
    ]);

    switch (mode) {
      case "text":
        setMessages((prevState) => [
          ...prevState,
          {
            author: "bot",
            text: "",
            type: "text-loading",
          },
        ]);
        break;
      case "image":
        setMessages((prevState) => [
          ...prevState,
          { author: "bot", text: "", type: "image-loading" },
        ]);
        setInputEnabled(false);
        generateImage(uuid!, newMessage)
          .then((data) => {
            setMessages((prevState) => [
              ...prevState.slice(0, -1),
              { author: "bot", text: data.data, type: "image" },
            ]);
          })
          .catch(() => {
            setMessages((prevState) => [
              ...prevState.slice(0, -1),
              {
                author: "bot",
                text: "Can't generate image. Please try again",
                type: "error",
              },
            ]);
          })
          .finally(() => {
            setInputEnabled(true);
          });
        break;
    }
  };

  useEffect(() => {
    // Function to fetch the conversation
    const loadConversation = async () => {
      try {
        const response = await fetchConversation(uuid!);
        if (response.data && response.data.messages) {
          // Transform and set the messages
          const transformedMessages = response.data.messages.flatMap((msg: any) => ([
            {
              author: "user",
              text: msg.prompt,
              type: "text"
            },
            {
              author: "bot",
              text: msg.answer,
              type: "text"
            }
          ]));
          setMessages(transformedMessages);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    // Call the function to load the conversation
    if (uuid) {
      loadConversation();
    }

    // ... rest of the useEffect hook ...
  }, [uuid]);  

  useEffect(() => {
    const onopen = (res: Response) => {
      if (res.ok && res.status === 200) {
        setMessages((prevState) => [
          ...prevState.slice(0, -1),
          {
            author: "bot",
            text: "",
            type: "text",
          },
        ]);
        setInputEnabled(false);
      } else {
        setMessages((prevState) => [
          ...prevState.slice(0, -1),
          {
            author: "bot",
            text: "Can't generate text. Please try again",
            type: "error",
          },
        ]);
      }
    };

    const onmessage = (event: EventSourceMessage) => {
      setMessages((prevState) => [
        ...prevState.slice(0, -1),
        {
          ...prevState[prevState.length - 1],
          text: prevState[prevState.length - 1].text + event.data,
        },
      ]);
    };

    const onerror = (err: any) => {
      if (messages[messages.length - 1]?.type === "text-loading") {
        setMessages((prevState) => [
          ...prevState.slice(0, -1),
          {
            author: "bot",
            text: "Error during text generation. Please try again",
            type: "error",
          },
        ]);
      } else {
        setMessages((prevState) => [
          ...prevState,
          {
            author: "bot",
            text: "Error during text generation. Please try again",
            type: "error",
          },
        ]);
      }
      throw new Error();
    };

    const onclose = () => {
      setInputEnabled(true);
    };

    if (
      messages[messages.length - 1]?.author === "bot" &&
      messages[messages.length - 1]?.type === "text-loading"
    ) {
      fetchTextMessage(
        uuid!,
        messages[messages.length - 2].text,
        onopen,
        onmessage,
        onerror,
        onclose,
      ).catch(() => setInputEnabled(true));
    }
  }, [messages, uuid]);

  return (
    <Box sx={{ height: "100vh", overflowY: "auto", position: "relative" }}>
      <MessagesContainer messages={messages} />
      <InputBar
        onSendMessage={handleSendMessage}
        enabled={inputEnabled}
        mode={mode}
        setMode={setMode}
      />
    </Box>
  );
};

export default ChatWindow;
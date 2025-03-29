import { Request, Response } from "express";
import prisma from "../db/prisma";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    if (!req.user?.id) {
      throw new Error("User is not authenticated");
    }

    const senderId = req.user.id;

    let conversation = await prisma.conversations.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, receiverId],
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversations.create({
        data: {
          participantsIds: {
            set: [senderId, receiverId],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        senderId,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      conversation = await prisma.conversations.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.log("error while sending message", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;

    if (!req.user?.id) {
      res.status(401).json({ message: "User is not authenticated" });
      return;
    }
    const senderId = req.user.id;

    const conversation = await prisma.conversations.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, userToChatId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(conversation.messages);
    return;
  } catch (error: any) {
    console.log("error while getting message", error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const getUserForSidebar = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      console.log("User is not authenticated");
      return;
    }
    const authUser = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUser,
        },
      },
      select: {
        id: true,
        fullname: true,
        profilePic: true,
      },
    });

    res.status(200).json(users);
    return;
  } catch (error: any) {
    console.log("error while getting user for sidebar", error.message);
    res.status(500).json({ error: " Internal server Error" });
    return;
  }
};

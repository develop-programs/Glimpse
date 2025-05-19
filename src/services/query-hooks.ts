import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { socketService } from "./socket";

// Auth query keys
export const authKeys = {
  all: ["auth"] as const,
  verify: () => [...authKeys.all, "verify"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// Room query keys
export const roomKeys = {
  all: ["rooms"] as const,
  lists: () => [...roomKeys.all, "list"] as const,
  list: (filters: any) => [...roomKeys.lists(), { filters }] as const,
  details: () => [...roomKeys.all, "detail"] as const,
  detail: (id: string) => [...roomKeys.details(), id] as const,
  messages: (roomId: string) =>
    [...roomKeys.detail(roomId), "messages"] as const,
};

// Message query keys
export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (roomId: string) => [...messageKeys.lists(), roomId] as const,
};

// Auth hooks
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.login(email, password),
    onSuccess: (data) => {
      // Store the token in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      // Connect the socket and authenticate it
      socketService.connect();
      socketService.authenticate();
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => api.auth.register(username, email, password),
  });
}

export function useVerifyAuth() {
  return useQuery({
    queryKey: authKeys.verify(),
    queryFn: () => api.auth.verify(),
    enabled: !!localStorage.getItem("auth_token"), // Only run if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// Room hooks
export function useRooms() {
  return useQuery({
    queryKey: roomKeys.lists(),
    queryFn: () => api.rooms.getAll(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useRoom(roomId: string) {
  return useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => api.rooms.getById(roomId),
    enabled: !!roomId,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => api.rooms.create(name, description),
    onSuccess: () => {
      // Invalidate rooms queries to refetch room list
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useJoinRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => api.rooms.join(roomId),
    onSuccess: (_, roomId) => {
      // Invalidate room detail query
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });

      // Also join room via socket
      socketService.joinRoom(roomId);
    },
  });
}

export function useLeaveRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => api.rooms.leave(roomId),
    onSuccess: (_, roomId) => {
      // Invalidate room detail query
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });

      // Also leave room via socket
      socketService.leaveRoom(roomId);
    },
  });
}

export function useRoomMessages(
  roomId: string,
  page: number = 1,
  limit: number = 50
) {
  return useQuery({
    queryKey: [...roomKeys.messages(roomId), { page, limit }],
    queryFn: () => api.rooms.getMessages(roomId, page, limit),
    enabled: !!roomId,
  });
}

// Message hooks
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, content }: { roomId: string; content: string }) =>
      api.messages.send(roomId, content),
    onSuccess: (_, { roomId }) => {
      // Invalidate messages query
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(roomId),
      });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      roomId,
    }: {
      messageId: string;
      roomId: string;
    }) => api.messages.delete(messageId),
    onSuccess: (_, { roomId }) => {
      // Invalidate messages query
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(roomId),
      });
    },
  });
}

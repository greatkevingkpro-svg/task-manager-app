import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";

// Backend base URL. For Expo web, this should point to your machine IP + backend port.
const API_URL = "http://10.50.25.43:8080/api/tasks";

export default function App() {
  // Task list returned by the backend.
  const [tasks, setTasks] = useState([]);
  // Form fields for creating a task.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  // UI loading flags.
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Tracks which task is being completed/deleted to disable repeated taps.
  const [actionTaskId, setActionTaskId] = useState(null);

  // Fetches all tasks from backend and updates list state.
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Creates a new task using the form values.
  const createTask = async () => {
    if (!title.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(API_URL, {
        title: title.trim(),
        description: description.trim(),
        status: status.trim() || "TODO",
      });

      setTitle("");
      setDescription("");
      setStatus("TODO");
      await fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Initial load on first render.
  useEffect(() => {
    fetchTasks();
  }, []);

  // Marks a task as completed and updates local state for instant feedback.
  const completeTask = async (taskId) => {
    if (!taskId) {
      return;
    }

    setActionTaskId(taskId);
    try {
      await axios.patch(`${API_URL}/${taskId}/complete`);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          (task.id || task._id) === taskId ? { ...task, status: "DONE" } : task
        )
      );
    } catch (error) {
      console.error("Failed to complete task:", error.message);
    } finally {
      setActionTaskId(null);
    }
  };

  // Optimistic delete: remove from UI first, then rollback if API fails.
  const deleteTask = async (taskId) => {
    if (!taskId) {
      return;
    }

    setActionTaskId(taskId);
    const previousTasks = tasks;
    setTasks((prevTasks) =>
      prevTasks.filter((task) => (task.id || task._id) !== taskId)
    );
    try {
      await axios.delete(`${API_URL}/${taskId}`);
    } catch (error) {
      try {
        await axios.post(`${API_URL}/${taskId}/delete`);
      } catch (fallbackError) {
        console.error(
          "Failed to delete task:",
          fallbackError.response?.data || fallbackError.message
        );
        setTasks(previousTasks);
      }
    } finally {
      setActionTaskId(null);
    }
  };

  // Renders one task card in the FlatList.
  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={[styles.taskTitle, item.status === "DONE" && styles.taskTitleDone]}>
        {item.title}
      </Text>
      <Text style={styles.taskText}>{item.description || "No description"}</Text>
      <Text style={[styles.taskStatus, item.status === "DONE" && styles.taskStatusDone]}>
        Status: {item.status || "TODO"}
      </Text>
      <View style={styles.actionRow}>
        {item.status !== "DONE" && (
          <TouchableOpacity
            style={[styles.smallButton, styles.completeButton]}
            onPress={() => completeTask(item.id || item._id)}
            disabled={actionTaskId === (item.id || item._id)}
          >
            <Text style={styles.smallButtonText}>
              {actionTaskId === (item.id || item._id) ? "Working..." : "Complete"}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.smallButton, styles.deleteButton]}
          onPress={() => deleteTask(item.id || item._id)}
          disabled={actionTaskId === (item.id || item._id)}
        >
          <Text style={styles.smallButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.heading}>Task Manager</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Task description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Status (TODO, IN_PROGRESS, DONE)"
          value={status}
          onChangeText={setStatus}
        />

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={createTask}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? "Adding..." : "Add Task"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Tasks</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id || item._id}
          renderItem={renderTask}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Page-level layout styles.
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  // Create task form styles.
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  // Task list section styles.
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  listContainer: {
    paddingBottom: 30,
  },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  taskText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 6,
  },
  taskStatus: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "600",
    marginBottom: 8,
  },
  taskStatusDone: {
    color: "#16a34a",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  completeButton: {
    backgroundColor: "#10b981",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  smallButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import type { AuditLogEntry } from "../../types/api";

interface AuditTrailProps {
  logs: AuditLogEntry[];
}

export function AuditTrail({ logs }: AuditTrailProps) {
  if (logs.length === 0) {
    return (
      <Text style={styles.empty}>No activity recorded yet</Text>
    );
  }

  return (
    <View style={styles.container}>
      {logs.map((log) => {
        const details = log.details as { message?: string } | null;
        const message = details?.message ?? log.action.replace(/_/g, " ").toLowerCase();
        return (
          <View key={log.id} style={styles.entry}>
            <View style={styles.dot} />
            <View style={styles.content}>
              <Text style={styles.message}>{message}</Text>
              <Text style={styles.meta}>
                {log.user.name} · {format(new Date(log.timestamp), "MMM d, HH:mm")}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  entry: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginTop: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    textTransform: "capitalize",
  },
  meta: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  empty: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CommunityPostCard({ item }) {
  return (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() =>
        router.push({
          pathname: "/community/post",
          params: { postId: item.id },
        })
      }
    >
      <View style={styles.postHeader}>
        <Image
          source={{
            uri: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <Text style={styles.username}>{item.users?.name}</Text>
            <Ionicons name="checkmark-circle" size={16} color="#2695A6" />
            <Text style={styles.level}>{item.level}</Text>
          </View>
          <Text style={styles.Bio}>Cooking up ambition</Text>
        </View>
        <Text style={styles.postDate}>2 hours ago</Text>
      </View>

      <Text style={styles.postTitle}>{item.title}</Text>

      <View style={styles.tagsContainer}>
        <View style={styles.tagsContainer}>
          <View
            style={[styles.tag, item.category === "Urgent" && styles.urgentTag]}
          >
            <Text
              style={[
                styles.tagText,
                item.category === "Urgent" && styles.urgentTagText,
              ]}
            >
              {item.category}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.postContent} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.postFooter}>
        <Text style={styles.repliesText}>{item.replies} Replies</Text>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read More</Text>
          <Ionicons name="chevron-forward" size={16} color="#2695A6" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  // user
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "dark-grey",
    marginRight: 4,
  },
  level: {
    fontSize: 12,
    color: "grey",
    marginLeft: 5,
  },
  Bio: {
    fontSize: 12,
    color: "grey",
    marginTop: 4,
    marginLeft: 1,
  },
  // user end

  postDate: {
    fontSize: 12,
    color: "grey",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: "#1976D2",
    fontWeight: "500",
  },
  urgentTag: {
    backgroundColor: "#FFEBEE",
  },
  urgentTagText: {
    color: "#D32F2F",
  },
  postContent: {
    fontSize: 14,
    color: "grey",
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  repliesText: {
    fontSize: 12,
    color: "light-grey",
    marginLeft: 0,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMoreText: {
    fontSize: 12,
    color: "#2695A6",
    fontWeight: "500",
    marginRight: 4,
  },
});

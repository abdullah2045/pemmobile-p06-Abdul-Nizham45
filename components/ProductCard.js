import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProductCard({ item, numColumns, onPress }) {
  const cardWidth = numColumns === 2 ? width / 2 - 24 : "100%";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, { width: cardWidth }]}
      onPress={() => onPress(item)}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.imageEmoji}>{item.image}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            Rp {item.price.toLocaleString("id-ID")}
          </Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 8,
    // Shadow untuk iOS & Android
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    height: 120,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imageEmoji: { fontSize: 50 },
  category: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  name: { fontSize: 15, fontWeight: "700", color: "#1E293B", marginBottom: 8 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 14, fontWeight: "bold", color: "#0284C7" },
  ratingBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: { fontSize: 11, color: "#475569", fontWeight: "600" },
});

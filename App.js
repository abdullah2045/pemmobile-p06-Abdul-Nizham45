import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PRODUCTS } from "./data/products";
import ProductCard from "./components/ProductCard";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // State untuk Detail Produk
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // State BARU untuk Keranjang (Menyimpan Array Data Produk, bukan cuma angka)
  const [cartItems, setCartItems] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);

  const categories = ["Semua", "Pakaian", "Sepatu", "Aksesoris"];

  // Logika Filter Produk
  const filteredData = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const keyword = searchQuery.trim().toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword);
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Hitung total item & harga di keranjang secara otomatis
  const totalCartItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems],
  );
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems],
  );

  // Fungsi Tambah ke Keranjang
  const handleAddToCart = (product) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Jika produk sudah ada, tambah jumlahnya (qty)
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      // Jika produk baru, masukkan ke array dengan qty: 1
      return [...prevCart, { ...product, qty: 1 }];
    });
    setDetailVisible(false); // Tutup modal detail
    alert("Produk berhasil ditambahkan ke keranjang! 🛒");
  };

  // Fungsi Ubah Jumlah di Keranjang (Plus / Minus)
  const updateCartQty = (id, action) => {
    setCartItems((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = action === "plus" ? item.qty + 1 : item.qty - 1;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0); // Hapus produk jika qty jadi 0
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Selamat Belanja,</Text>
          <Text style={styles.userText}>Abdul 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => setCartVisible(true)}
        >
          <Ionicons name="cart-outline" size={24} color="#0F172A" />
          {totalCartItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalCartItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#64748B" />
        <TextInput
          style={styles.input}
          placeholder="Cari item atau kategori..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      </View>

      {/* CHIP KATEGORI */}
      <View style={{ marginBottom: 15 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedCategory === item && styles.chipActive,
              ]}
              onPress={() => {
                setSelectedCategory(item);
                setSearchQuery("");
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === item && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* DAFTAR PRODUK UTAMA */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            numColumns={2}
            onPress={() => {
              setSelectedProduct(item);
              setDetailVisible(true);
            }}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="sad-outline" size={48} color="#CBD5E1" />
            <Text style={{ color: "#64748B", marginTop: 10 }}>
              Produk "{searchQuery}" tidak ditemukan.
            </Text>
          </View>
        }
      />

      {/* ================================================== */}
      {/* 1. MODAL DETAIL PRODUK */}
      {/* ================================================== */}
      <Modal animationType="slide" transparent={true} visible={detailVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setDetailVisible(false)}
                >
                  <Ionicons name="close" size={28} color="#1E293B" />
                </TouchableOpacity>
                <View style={styles.detailImageBg}>
                  <Text style={{ fontSize: 100 }}>{selectedProduct.image}</Text>
                </View>
                <View style={styles.detailBody}>
                  <Text style={styles.detailCategory}>
                    {selectedProduct.category}
                  </Text>
                  <Text style={styles.detailName}>{selectedProduct.name}</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailPrice}>
                      Rp {selectedProduct.price.toLocaleString("id-ID")}
                    </Text>
                    <View style={styles.ratingBox}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.ratingVal}>
                        {selectedProduct.rating}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.descTitle}>Deskripsi Produk</Text>
                  <Text style={styles.descText}>
                    Produk berkualitas tinggi untuk kategori{" "}
                    {selectedProduct.category}. Nyaman digunakan dan awet.
                  </Text>

                  <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={() => handleAddToCart(selectedProduct)}
                  >
                    <Ionicons
                      name="cart"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.buyBtnText}>Tambah ke Keranjang</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ================================================== */}
      {/* 2. MODAL KERANJANG BELANJA (BARU & SEMPURNA) */}
      {/* ================================================== */}
      <Modal
        animationType="slide"
        visible={cartVisible}
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.cartContainer}>
          {/* Header Keranjang */}
          <View style={styles.cartHeader}>
            <TouchableOpacity onPress={() => setCartVisible(false)}>
              <Ionicons name="chevron-back" size={28} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.cartTitle}>Keranjang Saya</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Isi Keranjang */}
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
            ListEmptyComponent={
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={64} color="#CBD5E1" />
                <Text style={styles.emptyCartText}>
                  Keranjangmu masih kosong nih.
                </Text>
                <TouchableOpacity
                  style={styles.shopNowBtn}
                  onPress={() => setCartVisible(false)}
                >
                  <Text style={styles.shopNowText}>Mulai Belanja</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <View style={styles.cartImgBox}>
                  <Text style={{ fontSize: 30 }}>{item.image}</Text>
                </View>
                <View style={styles.cartInfo}>
                  <Text style={styles.cartItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.cartItemPrice}>
                    Rp {item.price.toLocaleString("id-ID")}
                  </Text>
                </View>
                {/* Tombol Plus Minus */}
                <View style={styles.qtyBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateCartQty(item.id, "minus")}
                  >
                    <Ionicons name="remove" size={16} color="#0F172A" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateCartQty(item.id, "plus")}
                  >
                    <Ionicons name="add" size={16} color="#0F172A" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* Footer Total Harga (Hanya muncul jika ada barang) */}
          {cartItems.length > 0 && (
            <View style={styles.cartFooter}>
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total Harga</Text>
                <Text style={styles.totalPrice}>
                  Rp {totalPrice.toLocaleString("id-ID")}
                </Text>
              </View>
              <TouchableOpacity style={styles.checkoutBtn}>
                <Text style={styles.checkoutText}>
                  Checkout ({totalCartItems})
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: { fontSize: 14, color: "#64748B" },
  userText: { fontSize: 20, fontWeight: "bold", color: "#0F172A" },
  cartBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#EF4444",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F8FAFC",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: { backgroundColor: "#0284C7", borderColor: "#0284C7" },
  chipText: { color: "#64748B", fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  list: { paddingHorizontal: 8, paddingBottom: 20 },
  empty: { alignItems: "center", marginTop: 50 },

  /* STYLES MODAL DETAIL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "85%",
    padding: 20,
  },
  closeBtn: { alignSelf: "flex-end", marginBottom: 10 },
  detailImageBg: {
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  detailBody: { marginTop: 20 },
  detailCategory: {
    color: "#0284C7",
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  detailName: { fontSize: 24, fontWeight: "bold", color: "#1E293B" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  detailPrice: { fontSize: 20, fontWeight: "bold", color: "#0284C7" },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: 6,
    borderRadius: 8,
  },
  ratingVal: { marginLeft: 5, fontWeight: "bold", color: "#92400E" },
  descTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  descText: { color: "#64748B", lineHeight: 22, marginTop: 5 },
  buyBtn: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#0284C7",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
  },
  buyBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  /* STYLES MODAL KERANJANG (BARU) */
  cartContainer: { flex: 1, backgroundColor: "#F8FAFC" },
  cartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  cartTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  cartList: { padding: 16, paddingBottom: 100 },
  emptyCart: { alignItems: "center", marginTop: 100 },
  emptyCartText: { color: "#64748B", fontSize: 16, marginTop: 10 },
  shopNowBtn: {
    marginTop: 20,
    backgroundColor: "#0284C7",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  shopNowText: { color: "#fff", fontWeight: "bold" },
  cartCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },
  cartImgBox: {
    width: 60,
    height: 60,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cartInfo: { flex: 1, marginLeft: 12 },
  cartItemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  cartItemPrice: { fontSize: 14, color: "#0284C7", fontWeight: "600" },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 1,
  },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: "bold" },
  cartFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 14, color: "#64748B" },
  totalPrice: { fontSize: 20, fontWeight: "bold", color: "#0F172A" },
  checkoutBtn: {
    backgroundColor: "#0284C7",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  checkoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

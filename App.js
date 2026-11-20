import React, { useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const GREEN = "#78E39A";
const BG = "#0B1711";
const PANEL = "#14251B";
const MUTED = "#A7B8AC";

export default function App() {
  const [messages, setMessages] = useState([
    { id: "welcome", role: "assistant", text: "Merhaba! Ben Yeşil Zeka. 🌿\\nBugün sana nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    const userMessage = { id: String(Date.now()), role: "user", text };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      // Gerçek AI yanıtları için README'deki sunucuyu çalıştırıp bu adresi ayarla.
      const response = await fetch("http://10.0.2.2:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, text }) => ({ role, content: text })) })
      });
      if (!response.ok) throw new Error("Sunucu yanıt vermedi");
      const data = await response.json();
      setMessages(prev => [...prev, {
        id: String(Date.now() + 1), role: "assistant",
        text: data.reply || "Şu anda yanıt oluşturamadım."
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: String(Date.now() + 1), role: "assistant",
        text: "Şu an AI sunucusuna bağlanamadım. Demo ekranı hazır; gerçek yanıtlar için README dosyasındaki sunucu kurulumunu tamamla."
      }]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([{ id: String(Date.now()), role: "assistant", text: "Yeni sohbet başladı! 🌿 Sana nasıl yardımcı olayım?" }]);
  }

  function renderMessage({ item }) {
    const mine = item.role === "user";
    return (
      <View style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "88%", marginVertical: 6 }}>
        {!mine && <Text style={{ color: GREEN, fontSize: 12, marginBottom: 5, fontWeight: "700" }}>YEŞİL ZEKA</Text>}
        <View style={{
          backgroundColor: mine ? "#245C3A" : PANEL,
          paddingVertical: 12, paddingHorizontal: 15, borderRadius: 18,
          borderBottomRightRadius: mine ? 5 : 18, borderBottomLeftRadius: mine ? 18 : 5
        }}>
          <Text style={{ color: "#F2F8F3", fontSize: 15, lineHeight: 22 }}>{item.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <View style={{ height: 66, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#203329" }}>
        <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: "#1E5634", alignItems: "center", justifyContent: "center", marginRight: 11 }}>
          <Text style={{ fontSize: 24 }}>🌿</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#F4FFF6", fontSize: 19, fontWeight: "800", letterSpacing: 0.2 }}>Yeşil Zeka</Text>
          <Text style={{ color: GREEN, fontSize: 11, marginTop: 2 }}>Yapay zekâ asistanın</Text>
        </View>
        <TouchableOpacity onPress={newChat} style={{ padding: 9, borderRadius: 12, backgroundColor: PANEL }}>
          <Text style={{ color: GREEN, fontWeight: "700", fontSize: 12 }}>+ Yeni</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 14 }}>
          {messages.length === 1 && (
            <View style={{ paddingTop: 20, paddingBottom: 16 }}>
              <Text style={{ color: "#F3FFF5", fontSize: 27, fontWeight: "800", lineHeight: 34 }}>Merhaba! 👋</Text>
              <Text style={{ color: GREEN, fontSize: 21, fontWeight: "700", marginTop: 3 }}>Bugün ne keşfediyoruz?</Text>
              <Text style={{ color: MUTED, fontSize: 14, marginTop: 9, lineHeight: 21 }}>Sorularını sor, fikirlerini paylaş veya birlikte yeni şeyler üretelim.</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 18 }}>
                {["💬 Sohbet et", "💡 Fikir üret", "📚 Öğren", "✍️ Yazı yaz"].map(label => (
                  <TouchableOpacity key={label} onPress={() => setInput(label.replace(/^\\S+\\s/, ""))} style={{ backgroundColor: PANEL, borderWidth: 1, borderColor: "#294635", paddingVertical: 10, paddingHorizontal: 13, borderRadius: 13, marginRight: 8, marginBottom: 8 }}>
                    <Text style={{ color: "#D8E9DC", fontSize: 13 }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          />
          {loading && <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}><ActivityIndicator color={GREEN} /><Text style={{ color: MUTED, marginLeft: 9 }}>Yeşil Zeka düşünüyor...</Text></View>}
        </View>
        <View style={{ paddingHorizontal: 13, paddingTop: 10, paddingBottom: Platform.OS === "ios" ? 8 : 14, borderTopWidth: 1, borderTopColor: "#203329" }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: PANEL, borderRadius: 17, borderWidth: 1, borderColor: "#294635", paddingLeft: 15, paddingRight: 7, minHeight: 52 }}>
            <TextInput
              value={input} onChangeText={setInput} placeholder="Yeşil Zeka'ya bir şey sor..."
              placeholderTextColor="#84968A" multiline maxLength={3000}
              style={{ flex: 1, color: "#F3FFF5", fontSize: 15, maxHeight: 110, paddingVertical: 12 }}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage} disabled={!input.trim() || loading} style={{ width: 39, height: 39, borderRadius: 13, backgroundColor: input.trim() ? "#2D8B50" : "#294235", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>↑</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: "#708477", textAlign: "center", fontSize: 10, marginTop: 7 }}>Yeşil Zeka hata yapabilir. Önemli bilgileri kontrol et.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
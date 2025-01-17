import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor"; // Supondo que o hook esteja configurado corretamente

interface ThemedPurchaseItemProps {
  id: string;
  descricaoCompra: string;
  totalCompra: number;
  valorInicialCompra: number;
  tipoCompra: number;
  statusCompra: number;
  created_at: string;
  updated_at: string;
  dataDaCompra: string;
  dataVencimento: string;
  isVencida: number;
}

export default function ThemedPurchaseItem({
  id,
  descricaoCompra,
  totalCompra,
  valorInicialCompra,
  tipoCompra,
  statusCompra,
  created_at,
  updated_at,
  dataDaCompra,
  dataVencimento,
  isVencida,
}: ThemedPurchaseItemProps) {
  const backgroundColor = useThemeColor({ light: "#f0f0f0", dark: "#333" }, "background");
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>Descrição: {descricaoCompra}</Text>
      <Text style={[styles.text, { color: textColor }]}>Total: R${totalCompra.toFixed(2)}</Text>
      <Text style={[styles.text, { color: textColor }]}>Data da Compra: {dataDaCompra}</Text>
      <Text style={[styles.text, { color: textColor }]}>
        Status: {isVencida ? "Vencida" : "Não Vencida"}
      </Text>
      <Text style={[styles.text, { color: textColor }]}>Vencimento: {dataVencimento}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
});

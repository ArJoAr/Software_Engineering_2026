import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// Importación de las capas locales (Mismo nivel de carpeta)
const BaymaxBaseImg = require('./base_baymax.png');
const GorraUpfImg = require('./gorra_upf.png');

// Tipos válidos de accesorios
type AccessoryType = 'none' | 'gorra_upf';

export default function AvatarScreen() {
  const router = useRouter();
  const { student, updateMonster3D } = useAuth();
  const { colors } = useTheme();

  // Guardamos el accesorio seleccionado en el estado local de React
  const [selectedAccessory, setSelectedAccessory] = useState<AccessoryType>(
    (student?.monster3D?.accessory as AccessoryType) || 'none'
  );

  const handleSave = async () => {
    // Persistimos el accesorio en el contexto global / base de datos
    await updateMonster3D({
      style: 'baymax',
      color: student?.monster3D?.color || 'white',
      accessory: selectedAccessory,
    });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* BARRA DE NAVEGACIÓN */}
      <View style={[styles.header, { backgroundColor: colors.primaryRed }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Baymax Studio 3D</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      {/* VIEWPORT CONTENEDOR (CANVAS COMPUESTO POR CAPAS) */}
      <View style={styles.viewportContainer}>
        <View style={[styles.canvasHD, { backgroundColor: '#F4F4F6' }]}>
          
          {/* CAPA 1: El cuerpo base del robot */}
          <Image 
            source={BaymaxBaseImg} 
            style={styles.layerImage} 
            resizeMode="contain"
          />

          {/* CAPA 2: Gorra de la UPF (Solo se renderiza si está seleccionada) */}
          {selectedAccessory === 'gorra_upf' && (
            <Image 
              source={GorraUpfImg} 
              style={styles.layerImage} 
              resizeMode="contain"
            />
          )}

        </View>
        <View style={styles.badgeHD}>
          <Sparkles size={12} color="#fff" />
          <Text style={styles.badgeText}>
            {selectedAccessory === 'none' ? 'BASE MODEL' : 'UPF EDITION'}
          </Text>
        </View>
      </View>

      {/* PANEL DE PERSONALIZACIÓN INFERIOR */}
      <ScrollView style={[styles.controlPanel, { backgroundColor: colors.card }]} contentContainerStyle={{ paddingBottom: 30 }}>
        
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>1. Character Matrix</Text>
        <View style={styles.row}>
          <View style={[styles.chip, { backgroundColor: '#ECECEF', borderColor: 'transparent' }]}>
            <Text style={[styles.chipText, { color: colors.textPrimary, fontWeight: '700' }]}>
              BAYMAX
            </Text>
          </View>
        </View>

        {/* NUEVA SECCIÓN: SELECCIÓN DE ACCESORIOS */}
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>2. Headwear & Accessories</Text>
        <View style={styles.row}>
          
          {/* Opción Desequipar */}
          <TouchableOpacity 
            style={[
              styles.chip, 
              { borderColor: colors.cardBorder }, 
              selectedAccessory === 'none' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }
            ]}
            onPress={() => setSelectedAccessory('none')}
          >
            <Text style={[
              styles.chipText, 
              { color: selectedAccessory === 'none' ? '#fff' : colors.textPrimary }, 
              selectedAccessory === 'none' && { fontWeight: '700' }
            ]}>
              NONE
            </Text>
          </TouchableOpacity>

          {/* Opción Gorra UPF */}
          <TouchableOpacity 
            style={[
              styles.chip, 
              { borderColor: colors.cardBorder }, 
              selectedAccessory === 'gorra_upf' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }
            ]}
            onPress={() => setSelectedAccessory('gorra_upf')}
          >
            <Text style={[
              styles.chipText, 
              { color: selectedAccessory === 'gorra_upf' ? '#fff' : colors.textPrimary }, 
              selectedAccessory === 'gorra_upf' && { fontWeight: '700' }
            ]}>
              🎓 UPF CAP
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Gracias a la superposición alfa de imágenes 2D, el accesorio encaja automáticamente sobre la cabeza en localhost sin desfases.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: { padding: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  saveBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#C8102E', fontSize: 12, fontWeight: '800' },
  
  viewportContainer: { height: '45%', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' },
  canvasHD: { 
    width: 250, 
    height: 250, 
    borderRadius: 125, 
    position: 'relative', 
    alignItems: 'center', 
    justifyContent: 'center',
    overflow: 'visible',
    borderWidth: 4,
    borderColor: '#fff',
    boxShadow: '0px 12px 30px rgba(0,0,0,0.1)'
  },
  // Al tener position absolute y medir ambas el 100%, se fusionarán de forma matemática perfecta
  layerImage: { position: 'absolute', width: '200%', height: '200%' },
  
  badgeHD: { position: 'absolute', bottom: 25, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#000', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  controlPanel: { flex: 1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, boxShadow: '0px -5px 20px rgba(0,0,0,0.03)' },
  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginTop: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },
  
  infoBox: { marginTop: 20, alignItems: 'center', paddingHorizontal: 10 },
  infoText: { fontSize: 13, textAlign: 'center', fontStyle: 'italic', lineHeight: 18 }
});
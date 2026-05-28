import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// 1. IMPORTACIÓN DE MODELOS BASE
const RobotBaseImg = require('./base_robot.png');
const GhostBaseImg = require('./base_ghost.png');
const MonsterBaseImg = require('./base_monster.png');

// 2. IMPORTACIÓN DE ACCESORIOS DE CABEZA (GORRAS)
const GorraUpfRobotImg = require('./gorra_upf_robot.png');
const GorraUpfGhostImg = require('./gorra_upf_ghost.png');
const GorraUpfMonsterImg = require('./gorra_upf_monster.png');

// 3. IMPORTACIÓN DE ACCESORIOS DE CABEZA ÚNICOS
const CascosRobotImg = require('./cascos_robot.png');     // 🔄 Cambiado por tornillo
const CuchilloGhostImg = require('./cuchillo_ghost.png');
const CuernosMonsterImg = require('./cuernos_monster.png');

// 4. 🆕 IMPORTACIÓN DE PINS (SECCIÓN COCO/PECHO)
const HeartRobotImg = require('./heart_robot.png');
const HeartGhostImg = require('./heart_ghost.png');
const HeartMonsterImg = require('./heart_monster.png');

// Tipos válidos para los estados
type CharacterType = 'robot' | 'ghost' | 'monster';
type AccessoryType = 'none' | 'gorra_upf' | 'cascos' | 'cuchillo' | 'cuernos';
type PinType = 'none' | 'heart'; // 🆕 Nuevo tipo para la sección Pins

export default function AvatarScreen() {
  const router = useRouter();
  const { student, updateMonster3D } = useAuth();
  const { colors } = useTheme();

  // Estado del personaje base activo
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>(
    (student?.monster3D?.style as CharacterType) || 'robot'
  );

  // Estado del accesorio de cabeza equipado
  const [selectedAccessory, setSelectedAccessory] = useState<AccessoryType>(
    (student?.monster3D?.accessory as AccessoryType) || 'none'
  );

  // 🆕 Estado para la nueva sección de Pins
  const [selectedPin, setSelectedPin] = useState<PinType>('none');

  const handleSave = async () => {
    await updateMonster3D({
      style: selectedCharacter,
      color: student?.monster3D?.color || 'white',
      accessory: selectedAccessory,
      // Nota: Si tu backend soporta guardar el pin, puedes pasarle la variable aquí:
      // pin: selectedPin,
    });
    router.back();
  };

  // Determinar dinámicamente qué personaje base renderizar
  const getBaseImage = () => {
    if (selectedCharacter === 'ghost') return GhostBaseImg;
    if (selectedCharacter === 'monster') return MonsterBaseImg;
    return RobotBaseImg;
  };

  // Devuelve el accesorio de cabeza según la selección y el personaje activo
  const getAccessoryImage = () => {
    if (selectedAccessory === 'gorra_upf') {
      if (selectedCharacter === 'ghost') return GorraUpfGhostImg;
      if (selectedCharacter === 'monster') return GorraUpfMonsterImg;
      return GorraUpfRobotImg;
    }
    
    if (selectedAccessory === 'cascos' && selectedCharacter === 'robot') return CascosRobotImg;
    if (selectedAccessory === 'cuchillo' && selectedCharacter === 'ghost') return CuchilloGhostImg;
    if (selectedAccessory === 'cuernos' && selectedCharacter === 'monster') return CuernosMonsterImg;

    return null;
  };

  // 🆕 FUNCIÓN CLAVE: Devuelve el PNG del Pin adaptado dinámicamente al pecho de cada personaje
  const getPinImage = () => {
    if (selectedPin === 'heart') {
      if (selectedCharacter === 'ghost') return HeartGhostImg;
      if (selectedCharacter === 'monster') return HeartMonsterImg;
      return HeartRobotImg;
    }
    return null;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* BARRA DE NAVEGACIÓN */}
      <View style={[styles.header, { backgroundColor: colors.primaryRed }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avatar Studio 3D</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      {/* VIEWPORT CONTENEDOR (CANVAS COMPUESTO POR 3 CAPAS) */}
      <View style={styles.viewportContainer}>
        <View style={[styles.canvasHD, { backgroundColor: '#F4F4F6' }]}>
          
          {/* CAPA 1: El cuerpo base del personaje */}
          <Image 
            source={getBaseImage()} 
            style={styles.layerImage}
            resizeMode="contain"
          />

          {/* CAPA 2: Accesorio de Cabeza Inteligente Superpuesto */}
          {selectedAccessory !== 'none' && getAccessoryImage() && (
            <Image 
              source={getAccessoryImage()} 
              style={styles.layerImage}
              resizeMode="contain"
            />
          )}

          {/* CAPA 3: 🆕 Pin en el Pecho Inteligente Superpuesto */}
          {selectedPin !== 'none' && getPinImage() && (
            <Image 
              source={getPinImage()} 
              style={styles.layerImage}
              resizeMode="contain"
            />
          )}

        </View>
        <View style={styles.badgeHD}>
          <Sparkles size={12} color="#fff" />
          <Text style={styles.badgeText}>
            {selectedCharacter.toUpperCase()} + {selectedAccessory.toUpperCase()} + PIN:{selectedPin.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* PANEL DE PERSONALIZACIÓN INFERIOR */}
      <ScrollView style={[styles.controlPanel, { backgroundColor: colors.card }]} contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* SECCIÓN 1: SELECCIÓN DE PERSONAJE BASE */}
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>1. Character Matrix</Text>
        <View style={styles.row}>
          
          {/* Opción Robot */}
          <TouchableOpacity 
            style={[
              styles.chip,
              { borderColor: colors.cardBorder },
              selectedCharacter === 'robot' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }
            ]}
            onPress={() => {
              setSelectedCharacter('robot');
              if (['cuchillo', 'cuernos'].includes(selectedAccessory)) setSelectedAccessory('none');
            }}
          >
            <Text style={[styles.chipText, { color: selectedCharacter === 'robot' ? '#fff' : colors.textPrimary }, selectedCharacter === 'robot' && { fontWeight: '700' }]}>
              ROBOT
            </Text>
          </TouchableOpacity>

          {/* Opción Ghost */}
          <TouchableOpacity 
            style={[
              styles.chip,
              { borderColor: colors.cardBorder },
              selectedCharacter === 'ghost' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }
            ]}
            onPress={() => {
              setSelectedCharacter('ghost');
              if (['cascos', 'cuernos'].includes(selectedAccessory)) setSelectedAccessory('none');
            }}
          >
            <Text style={[styles.chipText, { color: selectedCharacter === 'ghost' ? '#fff' : colors.textPrimary }, selectedCharacter === 'ghost' && { fontWeight: '700' }]}>
              GHOST
            </Text>
          </TouchableOpacity>

          {/* Opción Monster */}
          <TouchableOpacity 
            style={[
              styles.chip,
              { borderColor: colors.cardBorder },
              selectedCharacter === 'monster' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }
            ]}
            onPress={() => {
              setSelectedCharacter('monster');
              if (['cascos', 'cuchillo'].includes(selectedAccessory)) setSelectedAccessory('none');
            }}
          >
            <Text style={[styles.chipText, { color: selectedCharacter === 'monster' ? '#fff' : colors.textPrimary }, selectedCharacter === 'monster' && { fontWeight: '700' }]}>
              MONSTER
            </Text>
          </TouchableOpacity>

        </View>

        {/* SECCIÓN 2: SELECCIÓN DE ACCESORIOS DE CABEZA */}
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>2. Headwear & Accessories</Text>
        <View style={styles.row}>
          
          <TouchableOpacity 
            style={[styles.chip, { borderColor: colors.cardBorder }, selectedAccessory === 'none' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }]}
            onPress={() => setSelectedAccessory('none')}
          >
            <Text style={[styles.chipText, { color: selectedAccessory === 'none' ? '#fff' : colors.textPrimary }]}>NONE</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, { borderColor: colors.cardBorder }, selectedAccessory === 'gorra_upf' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }]}
            onPress={() => setSelectedAccessory('gorra_upf')}
          >
            <Text style={[styles.chipText, { color: selectedAccessory === 'gorra_upf' ? '#fff' : colors.textPrimary }]}>🎓 UPF CAP</Text>
          </TouchableOpacity>

          {/* Cascos (Exclusivo Robot) */}
          {selectedCharacter === 'robot' && (
            <TouchableOpacity 
              style={[styles.chip, { borderColor: colors.cardBorder }, selectedAccessory === 'cascos' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }]}
              onPress={() => setSelectedAccessory('cascos')}
            >
              <Text style={[styles.chipText, { color: selectedAccessory === 'cascos' ? '#fff' : colors.textPrimary }]}>🎧 CASCOS</Text>
            </TouchableOpacity>
          )}

          {/* Cuchillo (Exclusivo Ghost) */}
          {selectedCharacter === 'ghost' && (
            <TouchableOpacity 
              style={[styles.chip, { borderColor: colors.cardBorder }, selectedAccessory === 'cuchillo' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }]}
              onPress={() => setSelectedAccessory('cuchillo')}
            >
              <Text style={[styles.chipText, { color: selectedAccessory === 'cuchillo' ? '#fff' : colors.textPrimary }]}>🔪 CUCHILLO</Text>
            </TouchableOpacity>
          )}

          {/* Cuernos (Exclusivo Monster) */}
          {selectedCharacter === 'monster' && (
            <TouchableOpacity 
              style={[styles.chip, { borderColor: colors.cardBorder }, selectedAccessory === 'cuernos' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }]}
              onPress={() => setSelectedAccessory('cuernos')}
            >
              <Text style={[styles.chipText, { color: selectedAccessory === 'cuernos' ? '#fff' : colors.textPrimary }]}>😈 CUERNOS</Text>
            </TouchableOpacity>
          )}

        </View>

        {/* SECCIÓN 3: 🆕 NUEVA SECCIÓN DE PINS */}
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>3. Pins & Stickers</Text>
        <View style={styles.row}>
          
          {/* Opción Ninguno */}
          <TouchableOpacity 
            style={[
              styles.chip,
              { borderColor: colors.cardBorder },
              selectedPin === 'none' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }
            ]}
            onPress={() => setSelectedPin('none')}
          >
            <Text style={[styles.chipText, { color: selectedPin === 'none' ? '#fff' : colors.textPrimary }, selectedPin === 'none' && { fontWeight: '700' }]}>
              NONE
            </Text>
          </TouchableOpacity>

          {/* Opción Corazón (Universal, busca el archivo correspondiente de cada uno) */}
          <TouchableOpacity 
            style={[
              styles.chip,
              { borderColor: colors.cardBorder },
              selectedPin === 'heart' && { backgroundColor: colors.primaryRed, borderColor: colors.primaryRed }
            ]}
            onPress={() => setSelectedPin('heart')}
          >
            <Text style={[styles.chipText, { color: selectedPin === 'heart' ? '#fff' : colors.textPrimary }, selectedPin === 'heart' && { fontWeight: '700' }]}>
              ❤️ HEART
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            El sistema maneja de forma simultánea los accesorios de la cabeza y los stickers del pecho adaptándose a cada modelo base.
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
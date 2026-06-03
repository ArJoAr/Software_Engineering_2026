import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { Monster3DConfiguration } from '@/context/AuthContext';

const BASE_IMAGES: Record<string, any> = {
  robot:   require('@/app/avatar/base_robot.png'),
  ghost:   require('@/app/avatar/base_ghost.png'),
  monster: require('@/app/avatar/base_monster.png'),
};

const ACCESSORY_IMAGES: Record<string, Record<string, any>> = {
  gorra_upf: {
    robot:   require('@/app/avatar/gorra_upf_robot.png'),
    ghost:   require('@/app/avatar/gorra_upf_ghost.png'),
    monster: require('@/app/avatar/gorra_upf_monster.png'),
  },
  headphones: { robot: require('@/app/avatar/cascos_robot.png') },
  knife:      { ghost: require('@/app/avatar/cuchillo_ghost.png') },
  horns:      { monster: require('@/app/avatar/cuernos_monster.png') },
};

const PIN_IMAGES: Record<string, Record<string, any>> = {
  heart: {
    robot:   require('@/app/avatar/heart_robot.png'),
    ghost:   require('@/app/avatar/heart_ghost.png'),
    monster: require('@/app/avatar/heart_monster.png'),
  },
};

interface Props {
  config: Monster3DConfiguration;
  size?: number;
  bgColor?: string;
}

export function AvatarPreview({ config, size = 80, bgColor = '#F4F4F6' }: Props) {
  const style  = config.style  || 'robot';
  const acc    = config.accessory || 'none';
  const pin    = config.pin || 'none';

  const baseImg      = BASE_IMAGES[style];
  const accessoryImg = acc !== 'none' ? ACCESSORY_IMAGES[acc]?.[style] ?? null : null;
  const pinImg       = pin !== 'none' ? PIN_IMAGES[pin]?.[style]  ?? null : null;

  const radius   = size / 2;
  const imgSize  = size * 2;
  const imgOffset = -size / 2;

  return (
    <View style={[styles.canvas, { width: size, height: size, borderRadius: radius, backgroundColor: bgColor }]}>
      {baseImg && (
        <Image
          source={baseImg}
          style={{ position: 'absolute', width: imgSize, height: imgSize, top: imgOffset, left: imgOffset }}
          resizeMode="contain"
        />
      )}
      {accessoryImg && (
        <Image
          source={accessoryImg}
          style={{ position: 'absolute', width: imgSize, height: imgSize, top: imgOffset, left: imgOffset }}
          resizeMode="contain"
        />
      )}
      {pinImg && (
        <Image
          source={pinImg}
          style={{ position: 'absolute', width: imgSize, height: imgSize, top: imgOffset, left: imgOffset }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

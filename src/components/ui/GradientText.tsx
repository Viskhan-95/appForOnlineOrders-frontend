import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { GRADIENT_COLORS } from '../../utils/constans/colors';
import { TYPOGRAPHY } from '../../utils/constans/typography';
import { SIZES } from '../../utils/constans/sizes';

type GradientTextProps = {
  children: React.ReactNode;
  gradientColors?: readonly string[];
  fontSize?: number;
  style?: any;
};

const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  gradientColors = GRADIENT_COLORS.primary,
  fontSize = SIZES.fontSize.sm,
  style 
}) => {
  return (
    <MaskedView
      style={[styles.maskedView, style]}
      maskElement={
        <Text style={[styles.text, { fontSize }]}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskedView: {
    flexDirection: 'row',
    height: 20,
  },
  text: {
    fontFamily: TYPOGRAPHY.regular,
    backgroundColor: 'transparent',
    color: 'black', // черный для маски
  },
  gradient: {
    flex: 1,
    height: 20,
  },
});

export default GradientText;
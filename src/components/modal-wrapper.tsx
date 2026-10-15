// ModalWrapper.tsx
import useModalAnimationHook from "@/src/hooks/use-modal-animation-hook";
import React from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "./ui/typography";

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  stickyFooter?: boolean;
  maxHeightPct?: number;
  persistent?: boolean;
  removeScroll?: boolean;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  onClose,
  children,
  title,
  icon,
  footer,
  stickyFooter,
  maxHeightPct = 90,
  persistent = false,
  removeScroll = false,
}) => {
  const { fadeAnim, scaleAnim } = useModalAnimationHook({ visible });
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      presentationStyle="overFullScreen"
      onRequestClose={() => {
        if (!persistent) onClose();
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Animated.View
          className="flex-1 justify-end"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity
            onPress={() => {
              if (!persistent) onClose();
            }}
            activeOpacity={1}
            className="absolute inset-0 bg-black/60"
          />

          <Animated.View
            className="bg-white rounded-t-[32px] overflow-hidden"
            style={{
              transform: [{ scale: scaleAnim }],
              maxHeight: SCREEN_HEIGHT * (maxHeightPct / 100),
            }}
          >
            {removeScroll && (
              <ModalContent
                icon={icon}
                title={title}
                footer={footer}
                stickyFooter={stickyFooter}
              >
                {children}
              </ModalContent>
            )}

            {!removeScroll && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <ModalContent
                  icon={icon}
                  title={title}
                  footer={footer}
                  stickyFooter={stickyFooter}
                >
                  {children}
                </ModalContent>
              </ScrollView>
            )}

            {stickyFooter && footer && (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                {footer}
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const ModalContent = ({
  icon,
  title,
  children,
  footer,
  stickyFooter,
}: {
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  stickyFooter?: boolean;
}) => {
  return (
    <View className="p-6 gap-6">
      {/* ÍCONE */}
      {icon && <View className="items-center">{icon}</View>}

      {/* TÍTULO */}
      {title && (
        <View>
          <Typography variant="title" weight="bold" align="center">
            {title}
          </Typography>
        </View>
      )}

      {/* CONTEÚDO */}
      {children}

      {/* FOOTER */}
      {!stickyFooter && footer && <View className="mt-4">{footer}</View>}
    </View>
  );
};

import { BlurView } from "expo-blur";
import { router } from "expo-router";
import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppSymbol } from "./app-symbol";
import { GlassSurface } from "./glass-surface";
import { Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/** Pop when there is history; otherwise land on the task list. A screen
 * opened cold (deep link, state restore) is the stack's only entry, and a
 * bare router.back() there throws GO_BACK unhandled. */
export function navigateBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/");
}

/** Content inset for screens whose scrolling content runs under the
 * floating glass header. */
export function useScreenHeaderInset() {
  const insets = useSafeAreaInsets();
  return insets.top + 62;
}

/**
 * Floating chrome header: a glass back button, a glass title capsule with an
 * optional "project · daemon" subtitle, and an optional trailing accessory
 * cluster. Positioned absolutely so content scrolls beneath the glass.
 */
export function ScreenHeader({
  title,
  subtitle,
  right,
  scrolled = false,
}: {
  title: string;
  subtitle?: string | null;
  right?: ReactNode;
  /** Content has scrolled under the header: show the translucent chrome
   * backdrop with its hairline bottom edge, like a native navigation bar. */
  scrolled?: boolean;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  return (
    <View
      pointerEvents="box-none"
      style={[styles.bar, { paddingTop: insets.top + 6 }]}
    >
      {scrolled && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            {
              borderBottomColor: theme.borderStrong,
              backgroundColor:
                colorScheme === "dark" ? "#333333e3" : "#ffffffd6",
            },
          ]}
        >
          <BlurView intensity={6} style={StyleSheet.absoluteFill} />
        </View>
      )}
      <GlassSurface interactive style={styles.roundButton}>
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          hitSlop={6}
          onPress={navigateBack}
          style={({ pressed }) => [
            styles.roundButtonInner,
            { opacity: pressed ? 0.55 : 1 },
          ]}
        >
          <AppSymbol
            name={{
              ios: "chevron.left",
              android: "arrow_back",
              web: "arrow_back",
            }}
            size={17}
            tintColor={theme.text}
          />
        </Pressable>
      </GlassSurface>
      <View style={styles.titles}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, { color: theme.textTertiary }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? <View style={styles.rightSpacer} />}
    </View>
  );
}

/** Pill grouping trailing header actions, like the reference's [compose | …]. */
export function HeaderActionGroup({ children }: { children: ReactNode }) {
  return (
    <GlassSurface interactive style={styles.actionGroup}>
      {children}
    </GlassSurface>
  );
}

export function HeaderAction({
  icon,
  label,
  onPress,
}: {
  icon: Parameters<typeof AppSymbol>[0]["name"];
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [styles.action, { opacity: pressed ? 0.5 : 1 }]}
    >
      <AppSymbol name={icon} size={17} tintColor={theme.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    left: 0,
    paddingBottom: 10,
    paddingHorizontal: 12,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 20,
  },
  backdrop: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  roundButton: {
    borderRadius: Radius.pill,
    height: 44,
    width: 44,
  },
  roundButtonInner: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  titles: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: 2,
  },
  title: { fontSize: 17, fontWeight: "700", letterSpacing: -0.3 },
  subtitle: { fontSize: 12.5, marginTop: 1 },
  rightSpacer: { width: 44 },
  actionGroup: {
    alignItems: "center",
    borderRadius: Radius.pill,
    flexDirection: "row",
    height: 44,
    paddingHorizontal: 4,
  },
  action: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 42,
  },
});

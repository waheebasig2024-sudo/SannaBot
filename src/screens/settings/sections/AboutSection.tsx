import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { t } from '../../../i18n';

interface AboutSectionProps {
  debugLogEnabled: boolean;
  onDebugLogEnabledChange: (enabled: boolean) => void;
}

export function AboutSection({
  debugLogEnabled,
  onDebugLogEnabledChange,
}: AboutSectionProps): React.JSX.Element {
  return (
    <>
      <View className="px-4 py-4 border-b border-surface-tertiary">
        <Text className="text-label-primary text-base font-bold mb-2">الحسن - المساعد الشخصي الذكي</Text>
        <Text className="text-label-secondary text-sm mb-1">برمجة وتطوير: وهيـب عساج</Text>
        <Text className="text-label-secondary text-sm mb-1">للتواصل: 736136681</Text>
        <Text className="text-label-tertiary text-xs mt-2">© 2026 جميع الحقوق محفوظة</Text>
      </View>
      <View
        className="p-4 border-b border-surface-tertiary"
        style={{ borderBottomWidth: StyleSheet.hairlineWidth }}>
        <Text className="text-label-secondary text-[13px]">Version 0.1.0 (Phase 1 MVP)</Text>
      </View>
      <View className="px-4 py-4 border-b border-surface-tertiary">
        <View className="flex-row items-center gap-4 mb-2">
          <Text className="text-2xl">📋</Text>
          <Text className="text-label-primary text-base font-medium flex-1">
            {t('settings.about.debugLog')}
          </Text>
          <Switch
            value={debugLogEnabled}
            onValueChange={onDebugLogEnabledChange}
            trackColor={{ false: '#3A3A3C', true: '#007AFF' }}
            thumbColor="#FFFFFF"
          />
        </View>
        {debugLogEnabled && (
          <Text className="text-label-secondary text-xs ml-12">
            {t('settings.about.debugFileHint')}
          </Text>
        )}
      </View>
    </>
  );
}

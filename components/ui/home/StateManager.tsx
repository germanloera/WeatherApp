import React, { useEffect, useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Skeleton } from './Skeleton';
import { ErrorCard } from './ErrorCard';

type ScreenState = 'loading' | 'error' | 'content';

interface StateManagerProps {
  /** Simulated latency in ms (dev only) */
  //latency?: number;
  isLoading: boolean, 
  /** Force error state for testing */
  forceFail?: boolean;
  /** Content render function */
  renderContent: () => React.ReactNode;
  /** Error title override */
  errorTitle?: string;
  /** Error description override */
  errorDescription?: string;
  /** Called after successful load */
  onLoaded?: () => void;
}

export function StateManager({
  isLoading = false,
  //latency = 1400,
  forceFail = false,
  renderContent,
  errorTitle,
  errorDescription,
  onLoaded,
}: StateManagerProps) {
  const [state, setState] = useState<ScreenState>('loading');
  const [retryKey, setRetryKey] = useState(0);
  const { theme } = useTheme();

 /* const load = useCallback(() => {
    setState('loading');
    const fail = forceFail;
    setTimeout(() => {
      if (fail) {
        setState('error');
      } else {
        setState('content');
        onLoaded?.();
      }
    }, latency);
  }, [latency, forceFail, onLoaded]);

  useEffect(() => {
    load();
  }, [load, retryKey]); */

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton theme={theme} />;
  }

  if (state === 'error') {
    return (
      <ErrorCard
        title={errorTitle}
        description={errorDescription}
        onRetry={handleRetry}
      />
    );
  }

  return <>{renderContent()}</>;
}

function LoadingSkeleton({ theme }: { theme: any }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Skeleton width="40%" height={12} borderRadius={6} />
          <View style={{ height: 8 }} />
          <Skeleton width="65%" height={28} borderRadius={8} />
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Skeleton width={36} height={36} borderRadius={18} />
          <Skeleton width={36} height={36} borderRadius={18} />
        </View>
      </View>
      <Skeleton width="100%" height={280} borderRadius={18} />
      <Skeleton width="50%" height={18} borderRadius={6} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Skeleton width="48%" height={90} borderRadius={14} />
        <Skeleton width="48%" height={90} borderRadius={14} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Skeleton width="48%" height={90} borderRadius={14} />
        <Skeleton width="48%" height={90} borderRadius={14} />
      </View>
      <Skeleton width="55%" height={18} borderRadius={6} />
      <View style={{ flexDirection: 'row', gap: 14 }}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} width={56} height={100} borderRadius={10} />
        ))}
      </View>
    </ScrollView>
  );
}

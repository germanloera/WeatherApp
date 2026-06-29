import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';

import { Header } from '@/components/ui/home/Header';

interface AboutScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export default function AboutScreen({ onNavigate, isDark, onToggleDark }: AboutScreenProps) {
  const { theme } = useTheme();

  return (
    <View>
      

      <View style={[styles.content, { backgroundColor: theme.colors.bg }]}>
        <Header
          greeting='Claro Weather'
          title='Acerca de'
          isDark={isDark}
          onToggleDark={onToggleDark}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.appIconSection}>
            <View style={[styles.appIcon, { backgroundColor: theme.colors.accent }]}>
              <View style={styles.appIconInner}>
                <View style={[styles.iconCircle, { borderColor: '#fff' }]} />
                <View style={styles.iconLines}>
                  <View style={[styles.iconLine, { backgroundColor: '#fff' }]} />
                  <View style={[styles.iconLine2, { backgroundColor: '#fff' }]} />
                </View>
              </View>
            </View>
            <Text style={[styles.appName, { color: theme.colors.fg, fontFamily: theme.fonts.display.fontFamily }]}>
              Claro
            </Text>
            <Text style={[styles.version, { color: theme.colors.muted }]}>
              Versión 1.0.0
            </Text>
          </View>

          <SectionList
            title='Información de la app'
            data={[
              { label: 'Nombre', value: 'Claro' },
              { label: 'Versión', value: '1.0.0 (build 1)' },
              { label: 'Idioma', value: 'Español (ES)' },
              { label: 'Compatibilidad', value: 'iOS 16.0+' },
            ]}
            theme={theme}
          />

          <View style={{ height: 20 }} />

          <SectionList
            title='Desarrollador'
            data={[
              { label: 'Desarrollado por', value: 'Germán Loera' },
              { label: 'Correo', value: 'germanloera@me.com', isLink: true, href: 'mailto:germanloera@me.com' },
              { label: 'Sitio web', value: 'germanloera.dev', isLink: true, href: '#' },
              {
                label: 'Rol',
                value: '',
                isBadge: true,
                badge: 'Desarrollador & Diseñador',
              },
            ]}
            theme={theme}
          />

          <View style={{ height: 20 }} />

          <SectionList
            title='Fuente de datos'
            data={[
              { label: 'API', value: 'National Weather Service' },
              { label: 'URL', value: 'api.weather.gov', isLink: true, href: 'https://api.weather.gov' },
              { label: 'Tipo', value: 'REST JSON' },
              { label: 'Cobertura', value: 'Estados Unidos' },
              { label: 'Licencia', value: 'Dominio público' },
            ]}
            theme={theme}
          />

          <View style={[styles.aboutBody, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.aboutText, { color: theme.colors.muted, fontFamily: theme.fonts.body.fontFamily }]}>
              <Text style={{ color: theme.colors.fg, fontWeight: '600' }}>Claro</Text>
              {' utiliza la '}
              <Text style={{ color: theme.colors.fg, fontWeight: '600' }}>API de National Weather Service</Text>
              {' (api.weather.gov), una interfaz REST gratuita y de dominio público mantenida por el gobierno de los Estados Unidos. Los datos meteorológicos provienen de las estaciones de observación del NWS, radares Doppler y modelos numéricos de predicción como el HRRR y GFS.'}
            </Text>
            <View style={{ height: 12 }} />
            <Text style={[styles.aboutText, { color: theme.colors.muted, fontFamily: theme.fonts.body.fontFamily }]}>
              Esta app no almacena datos personales ni comparte información de ubicación con terceros. Las consultas a la API se realizan bajo los términos de uso del NWS.
            </Text>
          </View>

          <View style={{ height: 20 }} />

          <SectionList
            title='Agradecimientos'
            data={[
              { label: 'National Weather Service', value: 'Datos meteorológicos abiertos' },
              { label: 'Open Design', value: 'Prototipado y diseño' },
              { label: 'Apple', value: 'Design System y Human Interface Guidelines' },
            ]}
            theme={theme}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.muted }]}>
              © 2026 Germán Loera. Todos los derechos reservados.
            </Text>
            <Text style={[styles.footerText, { color: theme.colors.muted }]}>
              Hecho con ♥ desde México
            </Text>
          </View>
        </ScrollView>
      </View>

    </View>
  );
}

// ─── Section List Sub-component ───────────────────────────────────────

interface SectionRow {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
  isBadge?: boolean;
  badge?: string;
}

function SectionList({ title, data, theme }: { title: string; data: SectionRow[]; theme: any }) {
  return (
    <View style={[styles.section]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.muted, fontFamily: theme.fonts.mono.fontFamily }]}>
        {title}
      </Text>
      <View style={[styles.sectionBody, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {data.map((row, i) => (
          <View
            key={i}
            style={[
              styles.sectionRow,
              { borderBottomColor: theme.colors.border },
              i === data.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Text style={[styles.rowLabel, { color: theme.colors.fg, fontFamily: theme.fonts.body.fontFamily }]}>
              {row.label}
            </Text>
            {row.isBadge && row.badge ? (
              <View style={[styles.badge, { backgroundColor: theme.colors.accentSoft }]}>
                <Text style={[styles.badgeText, { color: theme.colors.accent }]}>
                  {row.badge}
                </Text>
              </View>
            ) : row.isLink ? (
              <TouchableOpacity onPress={() => row.href && Linking.openURL(row.href)}>
                <Text style={[styles.rowValue, styles.linkValue, { color: theme.colors.accent }]}>
                  {row.value}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={[styles.rowValue, { color: theme.colors.muted, fontFamily: theme.fonts.body.fontFamily }]}
                numberOfLines={1}
              >
                {row.value}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: { flex: 1 },
  scroll: { flex: 1 },
  scrollInner: { paddingBottom: 8 },

  appIconSection: { alignItems: 'center', paddingTop: 24, paddingBottom: 8 },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  appIconInner: { alignItems: 'center', justifyContent: 'center' },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 4,
  },
  iconLines: { alignItems: 'center' },
  iconLine: { width: 18, height: 2, borderRadius: 1, marginBottom: 2 },
  iconLine2: { width: 14, height: 2, borderRadius: 1 },
  appName: { fontSize: 22, fontWeight: '700', letterSpacing: -0.44 },
  version: { fontSize: 13, marginTop: 2 },

  section: { marginHorizontal: 12 },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  sectionBody: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: 15, flex: 1 },
  rowValue: { fontSize: 14, textAlign: 'right', maxWidth: '55%' },
  linkValue: { textDecorationLine: 'underline' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: '500' },

  aboutBody: {
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  aboutText: { fontSize: 13, lineHeight: 20.8 },

  footer: { alignItems: 'center', paddingVertical: 16 },
  footerText: { fontSize: 11, marginVertical: 2 },
});

import { Eyebrow } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { AUTOSAVE_DEBOUNCE_MS } from '@/shared/utils/debounce';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

const MAX_LENGTH = 1000;

interface Props {
  serverNotes: string;
  onSave: (notes: string) => void;
}

const DetailNotes = ({ serverNotes, onSave }: Props) => {
  const t = useAppTheme();
  const [notes, setNotes] = useState(serverNotes ?? '');
  const [editing, setEditing] = useState(false);
  const lastSaved = useRef(serverNotes ?? '');

  useEffect(() => {
    if (serverNotes !== undefined && serverNotes !== lastSaved.current) {
      setNotes(serverNotes);
      lastSaved.current = serverNotes;
    }
  }, [serverNotes]);

  const debouncedSave = useDebouncedCallback((text: string) => {
    const trimmed = text.trim();
    if (trimmed === lastSaved.current) return;
    lastSaved.current = trimmed;
    onSave(trimmed);
  }, AUTOSAVE_DEBOUNCE_MS);

  const handleChange = (text: string) => {
    setNotes(text);
    debouncedSave(text);
  };

  const handleBlur = () => {
    debouncedSave.flush();
    setEditing(false);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.tokens.semantic.surface1,
          borderColor: t.tokens.semantic.hairline,
        },
      ]}
    >
      <Eyebrow style={styles.eyebrow}>Notes · journal</Eyebrow>
      <View style={[styles.quote, { borderLeftColor: t.tokens.semantic.accent }]}>
        <TextInput
          value={notes}
          onChangeText={handleChange}
          onFocus={() => setEditing(true)}
          onBlur={handleBlur}
          placeholder="No notes yet. Tap to write what this is making you feel."
          placeholderTextColor={t.tokens.semantic.inkFaint}
          multiline
          maxLength={MAX_LENGTH}
          style={[
            styles.input,
            {
              fontFamily: t.tokens.fonts.serifRegular,
              color: t.tokens.semantic.ink,
              minHeight: editing || notes ? 60 : 24,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 24,
    marginTop: 28,
    padding: 18,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  eyebrow: {
    marginBottom: 12,
  },
  quote: {
    borderLeftWidth: 2,
    paddingLeft: 14,
  },
  input: {
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.05,
    padding: 0,
    textAlignVertical: 'top',
  },
});

export default DetailNotes;

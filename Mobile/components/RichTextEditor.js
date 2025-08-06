/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Keyboard,
    LayoutAnimation,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

const parseMessage = message => {
    const patterns = [
        { regex: /\*([^\*]+)\*/g, style: 'bold' },
        { regex: /_([^_]+)_/g, style: 'italic' },
        { regex: /~([^~]+)~/g, style: 'strike' },
        { regex: /```([^`]+)```/g, style: 'mono' },
    ];

    const replaceRecursive = text => {
        for (const { regex, style } of patterns) {
            const match = regex.exec(text);
            if (match) {
                const start = match.index;
                const end = start + match[0].length;
                return [
                    ...replaceRecursive(text.slice(0, start)),
                    { text: match[1], style },
                    ...replaceRecursive(text.slice(end)),
                ];
            }
        }
        return text ? [{ text, style: 'plain' }] : [];
    };

    return replaceRecursive(message);
};

const chunkStyle = style => {
    switch (style) {
        case 'bold':
            return { fontWeight: 'bold' };
        case 'italic':
            return { fontStyle: 'italic' };
        case 'strike':
            return { textDecorationLine: 'line-through' };
        case 'mono':
            return {
                fontFamily: 'monospace',
                color: '#000',
                backgroundColor: '#eee',
                paddingHorizontal: 2,
            };
        default:
            return {};
    }
};

export const RichTextInput = ({ value, onChange, showPreview = true }) => {
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', e => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hide = Keyboard.addListener('keyboardDidHide', () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setKeyboardHeight(0);
        });
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const wrapSelection = symbol => {
        const before = value.slice(0, selection.start);
        const selected = value.slice(selection.start, selection.end);
        const after = value.slice(selection.end);

        const newValue = `${before}${symbol}${selected}${symbol}${after}`;
        const cursorOffset = symbol.length;

        onChange(newValue);
        setSelection({
            start: selection.start + cursorOffset,
            end: selection.end + cursorOffset,
        });
    };

    const formatted = parseMessage(value || 'Nothing to preview');

    return (
        <View className="pb-2" style={{ paddingBottom: keyboardHeight }}>
            <TextInput
                multiline
                className="border border-gray-400 rounded-lg p-3 min-h-[100px] text-base mb-3 text-white bg-black"
                value={value}
                onChangeText={onChange}
                placeholder="Type with *bold*, _italic_, etc..."
                placeholderTextColor="#CCC"
                onSelectionChange={({ nativeEvent }) => setSelection(nativeEvent.selection)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selection={selection}
                textAlignVertical="top"
            />

            {showPreview && (
                <>
                    <Text className="text-base text-[#333333] dark:text-[#E0E0E0] font-bold ml-3 my-2">Preview</Text>
                    <ScrollView className="max-h-32 mx-3 mb-20">
                        <Text className="text-sm leading-[22px] p-3 text-white bg-black">
                            {formatted.map((chunk, idx) => (
                                <Text key={idx} style={chunkStyle(chunk.style)}>
                                    {chunk.text}
                                </Text>
                            ))}
                        </Text>
                    </ScrollView>
                </>
            )}

            {isFocused && keyboardHeight > 0 && (
                <View
                    className="absolute left-0 right-0 h-12 bg-zinc-900 flex-row justify-around items-center border-t border-zinc-800 z-50"
                    style={{ bottom: keyboardHeight }}
                >
                    {[
                        { label: 'B', symbol: '*' },
                        { label: 'I', symbol: '_' },
                        { label: 'S', symbol: '~' },
                        { label: '<>', symbol: '```' },
                    ].map(btn => (
                        <TouchableOpacity
                            key={btn.symbol}
                            onPress={() => wrapSelection(btn.symbol)}
                            className="bg-zinc-800 px-3 py-1.5 rounded-md"
                        >
                            <Text className="text-white font-bold text-lg">{btn.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

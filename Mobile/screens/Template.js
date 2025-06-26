import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Modal,
    TouchableOpacity,
    Switch,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Trash, Plus } from 'lucide-react-native';

const callTypes = ["Incoming", "Outgoing", "Missed", "Rejected"];

export default function TemplateScreen() {
    const [templates, setTemplates] = useState([
        {
            id: 1,
            name: "Incoming Message",
            text: "Welcome to Call Software",
            type: "Incoming",
            active: true,
        },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: "",
        text: "",
        type: callTypes[0],
        active: true,
    });
    const [editIndex, setEditIndex] = useState(null);

    const saveTemplate = () => {
        if (editIndex !== null) {
            const updated = [...templates];
            updated[editIndex] = { ...newTemplate, id: updated[editIndex].id };
            setTemplates(updated);
        } else {
            setTemplates([
                ...templates,
                { ...newTemplate, id: Date.now().toString() },
            ]);
        }
        setModalVisible(false);
        setNewTemplate({ name: "", text: "", type: callTypes[0], active: true });
        setEditIndex(null);
    };

    const handleEdit = (index) => {
        setNewTemplate(templates[index]);
        setEditIndex(index);
        setModalVisible(true);
    };

    const handleDelete = (id) => {
        setTemplates(templates.filter((t) => t.id !== id));
    };

    return (
        <SafeAreaView className="flex-1 bg-black px-4 py-2">
            <Text className="text-white text-2xl font-bold mb-4">Message Templates</Text>

            <ScrollView className="flex-1">
                {templates.map((template, index) => (
                    <View key={template.id} className="bg-neutral-900 rounded-xl p-4 mb-4 shadow">
                        <Text className="text-white text-lg font-bold">{template.name}</Text>
                        <Text className="text-gray-400 mt-1 mb-3">{template.text}</Text>

                        <View className="flex-row justify-between items-center mb-2">
                            {/* <Text className="text-xs px-2 py-1 bg-blue-600 text-white rounded">RECEIVED</Text> */}
                            <Text className="text-xs px-2 py-1 bg-sky-700 text-white rounded">
                                {template.type.toUpperCase()}
                            </Text>

                            <Text className="text-xs px-2 py-1 bg-green-600 text-white rounded">
                                {template.active ? "Enabled" : "Disabled"}
                            </Text>
                        </View>

                        <View className="flex-row justify-end gap-4">
                            <TouchableOpacity onPress={() => handleEdit(index)}>
                                <Pencil color="white" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(template.id)}>
                                <Trash color="red" size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* ➕ Floating Action Button */}
            <TouchableOpacity
                onPress={() => {
                    setEditIndex(null);
                    setNewTemplate({ name: "", text: "", type: callTypes[0], active: true });
                    setModalVisible(true);
                }}
                className="absolute bottom-6 right-6 bg-sky-500 p-4 rounded-full shadow-lg"
            >
                <Plus color="white" size={24} />
            </TouchableOpacity>

            {/* ➕ Add/Edit Template Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black bg-opacity-90 justify-center px-6">
                    <View className="bg-neutral-900 p-6 rounded-2xl">
                        <Text className="text-white text-xl font-bold mb-4">
                            {editIndex !== null ? "Edit Template" : "Add Template"}
                        </Text>

                        <TextInput
                            placeholder="Template Name"
                            placeholderTextColor="#ccc"
                            value={newTemplate.name}
                            onChangeText={(text) => setNewTemplate({ ...newTemplate, name: text })}
                            className="border border-gray-700 text-white rounded px-3 py-2 mb-3"
                        />

                        <TextInput
                            placeholder="Message Text"
                            placeholderTextColor="#ccc"
                            value={newTemplate.text}
                            multiline
                            numberOfLines={4}
                            onChangeText={(text) => setNewTemplate({ ...newTemplate, text })}
                            className="border border-gray-700 text-white rounded px-3 py-2 mb-3 h-24 text-sm"
                        />

                        {/* Call Type Selector (simple list picker) */}
                        <View className="mb-4">
                            <Text className="text-gray-300 mb-1">Call Type</Text>
                            {callTypes.map((type) => (
                                <Pressable
                                    key={type}
                                    onPress={() => setNewTemplate({ ...newTemplate, type })}
                                    className={`px-3 py-2 mb-1 rounded ${newTemplate.type === type
                                        ? "bg-sky-600 text-white"
                                        : "bg-neutral-800 text-gray-400"
                                        }`}
                                >
                                    <Text
                                        className={`${newTemplate.type === type ? "text-white" : "text-gray-400"
                                            }`}
                                    >
                                        {type}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Active toggle */}
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-white">Active</Text>
                            <Switch
                                value={newTemplate.active}
                                onValueChange={(val) => setNewTemplate({ ...newTemplate, active: val })}
                            />
                        </View>

                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditIndex(null);
                                }}
                                className="bg-gray-700 px-4 py-2 rounded"
                            >
                                <Text className="text-white">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={saveTemplate}
                                className="bg-green-600 px-4 py-2 rounded"
                            >
                                <Text className="text-white font-semibold">
                                    {editIndex !== null ? "Update" : "Save"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Item {
  id: String;
  item: String;
}

interface Items extends Array<Item> {}

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<Items>([] as Items);
  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@todoapp_items').then((result: any) => {
      if (result !== null) {
        setItems(JSON.parse(result));
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@todoapp_items', JSON.stringify(items)).then(() => {
      setInputValue('');
      setModalVisible(false);
    });
  }, [items]);

  async function addItem() {
    const hash: String = (+new Date()).toString(36);

    if (items.length > 0) {
      setItems([
        ...items,
        {
          id: hash,
          item: inputValue,
        },
      ]);
    } else {
      setItems([
        {
          id: hash,
          item: inputValue,
        },
      ]);
    }
  }

  async function removeItem(hash: String) {
    const newItems = items.filter(item => item.id !== hash);
    if (newItems.length > 1) {
      setItems([...newItems]);
    } else if (newItems.length === 1) {
      setItems(newItems);
    } else {
      setItems([]);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={items}
        renderItem={({item}) => (
          <View key={item.id.toString()} style={styles.itemView}>
            <Text style={styles.itemText}>{item.item}</Text>
            <Pressable
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}>
              <Text style={styles.buttonText}>−</Text>
            </Pressable>
          </View>
        )}
      />
      <Pressable
        style={styles.fab}
        onPress={() => {
          setModalVisible(!modalVisible);
          setInputFocus(true);
        }}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.buttonClose}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.buttonText}>×</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Adicionar item</Text>
            <TextInput
              onChangeText={setInputValue}
              value={inputValue}
              maxLength={35}
              placeholder="Título do item"
              autoFocus={inputFocus}
              style={styles.modalInput}
            />
            <Pressable
              style={styles.buttonSubmit}
              onPress={() => {
                addItem();
              }}>
              <Text style={styles.buttonSubmitText}>Cadastrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 22,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  itemText: {
    fontWeight: '700',
    fontSize: 20,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 30,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 65,
    height: 65,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 500,
    zIndex: 2,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    position: 'absolute',
    backgroundColor: '#dc3545',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 120,
    right: 15,
    top: 15,
  },
  modalTitle: {
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: 1.5,
  },
  modalInput: {
    borderWidth: 1,
    width: '100%',
    marginVertical: 20,
    borderRadius: 4,
    paddingLeft: 10,
    borderColor: '#c3c3c3',
  },
  buttonSubmit: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
  },
  buttonSubmitText: {
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
});

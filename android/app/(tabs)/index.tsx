import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput,
  TouchableOpacity,
  FlatList 
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";


import Tarefa from "@/src/tarefa";
import { TarefaItem } from 'tarefas';

export default function App() {

  const [tarefa, setTafera] = useState('');
  const [tarefas, setTarefas] = useState<TarefaItem[]>([]); 

  function handleAdd() {
    if(tarefa === '') {
      return;
    }

    const dados = {
      key: String(new Date().getTime()),
      item: tarefa  
    }

    setTarefas(oldArray => [dados, ...oldArray]);
    setTafera('');
  }
  function handleDelete(key: string) {
    setTarefas((oldArray) => oldArray.filter((item) => item.key !== key));
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova tarefa..."
          value={tarefa}
          onChangeText={setTafera}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <FontAwesome name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <Tarefa data={item} delete={handleDelete} />}
        style={styles.list}
      />
    </View>
  )
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22272e',
    paddingTop: 40
  }, 
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
    marginTop: '3%',
    paddingStart: '5%',
    marginBottom: 12
  },
  containerInput: {
    flexDirection: 'row',
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  input: {
    width: '75%',
    backgroundColor: '#FBFBFB',
    height: 44,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  buttonAdd: {
    width: '20%',
    height: 46,
    backgroundColor: '#1E6F9F',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 4,
  },
  list: { 
    borderTopEndRadius: 16,
    borderTopStartRadius: 16, 
    flex: 1,
    backgroundColor: '#fff',
    paddingStart: '4%',
    paddingEnd: '4%', 
  }
})
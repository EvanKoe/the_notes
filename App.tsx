//! Standard imports
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AsyncStorage, Dimensions, FlatList, Keyboard, ListRenderItemInfo, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//* Local imports
import truncate from './Functions/truncate';
import { eng, fr } from './translations/translations';
import { Note, Translations } from './Types/types';

//? Icons
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useRef } from 'react';

//TODO Patch the useRef problem (see TODO comments)

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export default function App() {
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<Note[] | undefined>(undefined);
  const [isModalDisplayed, setIfModalDisplayed] = useState<boolean>(false);
  const [lang, setLang] = useState<Translations>(eng);
  const [current, setCurrent] = useState<Note | undefined>(undefined);
  const _titleRef = useRef<TextInput>();
  const _bodyRef = useRef<TextInput>();

  const save = async () => {
    if (current === undefined) {
      return;
    }
    let i: number = -1;
    let a: Note[] = []
    notes?.map((item: Note) => {
      if (item.id === current.id) {

      }
    })
    a = notes === undefined ? [current] : notes?.concat([current]);
    await AsyncStorage.setItem('noteStorage', JSON.stringify(a));
    return setNotes(a);
  }

  const getItem = (title: string | undefined, body: string | undefined) => {
    return (current === undefined) ? ({
      id: notes ? notes[notes?.length - 1].id + 1 : 0,
      title: title ?? lang.newNote,
      body: body ?? lang.newNote,
      created: new Date(Date.now()),
      lastModified: new Date(Date.now())
    }) : ({
      id: current.id,
      title: title ?? current.title,
      body: body ?? current.body,
      created: current.created,
      lastModified: new Date(Date.now())
    });
  } 

  useEffect(() => {
    if (isModalDisplayed) {
      return;
    }
    console.log('Reset current')
    setCurrent(undefined);
  }, [isModalDisplayed]);

  useEffect(() => {
    const fun = async () => { 
      const a: string | null = await AsyncStorage.getItem('noteStorage');

      setNotes((a === null) ? undefined : JSON.parse(a));
    };
    fun();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={() => alert('Menu will be released soon')}
        >
          <Feather
            name="menu"
            size={24}
            color="#ddd"
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder='Search notes'
          placeholderTextColor='#bbb'
          onChangeText={(e) => setSearchValue(e)}
          style={styles.searchInput}
        />
      </View>

      {/* Displaying notes */}
      { notes === undefined ? (
        <Text style={styles.emptyNotesText}>This looks empty !</Text>
      ) : (
        <FlatList
          numColumns={2}
          data={notes}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={({ item, index }: ListRenderItemInfo<Note>) => (
            <TouchableOpacity
              style={styles.noteTile}
              onPress={() => {
                setCurrent({ ...notes[index] })
                setIfModalDisplayed(true)
                if (!_titleRef?.current || !_bodyRef?.current) {
                  alert(lang.failedSave)
                }
                //TODO _titleRef.current.set = notes[index].title
                //TODO _bodyRef.current.value = notes[index].body
              }}
            >
              <Text style={styles.noteTileTitle}>{ truncate(item.title, 20) }</Text>
              <Text style={styles.noteTileBody}>{ truncate(item.body, 20) }</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add note button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          // If modal not displayed, then user pressed '+', so new note
          if (isModalDisplayed) {
            save();
          }
          setIfModalDisplayed(e => !e)
        }}
      >
        <AntDesign
          name={ !isModalDisplayed ? "plus" : current === undefined ? "close" : "save" }
          size={30}
          color="#ddd"
          style={styles.floatingButtonIcon}
        />
      </TouchableOpacity>

      {/* Modal new note */}
      { isModalDisplayed && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
          style={styles.newNoteBg}
        >
            <View style={styles.newNoteView}>
              <TextInput
                //TODO ref={_titleRef}
                placeholder='Title'
                placeholderTextColor='#bbb'
                style={styles.noteTitle}
                onChangeText={(e: string) => setCurrent(getItem(e, undefined))}
              />
              <TextInput
                //TODO ref={_bodyRef}
                placeholder='Note'
                autoFocus={current === undefined}
                multiline
                numberOfLines={30}
                placeholderTextColor='#bbb'
                style={styles.noteBody}
                onChangeText={(e: string) => setCurrent(getItem(undefined, e))}
              />
            </View>

            {/* Action bar */}
            <View style={styles.actionBar}>
              <AntDesign name="save" size={24} color="#ddd" />
            </View>
        </TouchableOpacity>
      ) }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    paddingHorizontal: 20
  },
  searchBar: {
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#414141',
    height: 50,
    width: WIDTH - 30,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10
  },
  menuIcon: {
    marginHorizontal: 20
  },
  searchInput: {
    color: '#ddd',
    fontSize: 16,
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0
  },
  noteTile: {
    marginVertical: 5,
    marginRight: 5,
    borderWidth: 2,
    width: (WIDTH - 40 - 10) / 2,
    borderRadius: 20,
    borderColor: '#999',
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  noteTileTitle: {
    color: '#ddd',
    fontWeight: 'bold'
  },
  noteTileBody: {
    color: '#bbb'
  },
  floatingButton: {
    zIndex: 2,
    height: 65,
    width: 65,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4C8EDB',
    borderRadius: 20
  },
  floatingButtonIcon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  emptyNotesText: {
    color: '#ddd',
    fontSize: 18,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  newNoteBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: HEIGHT,
    width: WIDTH,
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#000000bb'
  },
  newNoteView: {
    backgroundColor: '#212121',
    flex: 1,
    borderRadius: 15,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20
  },
  noteTitle: {
    color: '#4C8EDB',
    fontSize: 18,
    fontWeight: 'bold'
  },
  noteBody: {
    fontSize: 18,
    color: '#ddd',
    flex: 1,
    textAlignVertical: 'top',
  },
  actionBar: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    height: 50,
    width: WIDTH - 50,
    backgroundColor: '#3769a3',
    paddingHorizontal: 20,
    borderRadius: 40
  }
});

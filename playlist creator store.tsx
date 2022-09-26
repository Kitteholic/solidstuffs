import { render } from "solid-js/web";
import { For, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";

type Playlist = {
  color: string
  title: string
  songs: Song[]
}

type Song = {
  title: string
}

type Ev<T> = {
  currentTarget: {value:T}
}

const songs = [
  {title:"Song One"},
  {title:"Song Two"},
  {title:"Song Thre"},
  {title:"Song Fpir"},
  {title:"Song Five"}
]

const [store, setStore] = createStore({
  playlists: [] as Playlist[],
  count: 0,
  title: "",
  color: "",
  songId: -1
})

const updateStore = {
  increment(){
    setStore("count", store.count + 1)
  },
  setTitle(e: Ev<string>){
    setStore("title", e.currentTarget.value)
  },
  setColor(e: Ev<string>){
    setStore("color", e.currentTarget.value)
  },
  addPlaylist(){
    setStore("playlists", store.playlists.length, {songs: [], title: store.title, color: store.color})
  },
  setSongId(songId: number){
    setStore("songId", songId)
  },
  addSongToPlaylist(playlistId: number){
    const length = store.playlists[playlistId].songs.length
    setStore("playlists", playlistId, "songs", length, songs[store.songId])
  }
}

function ShowPlaylist() {
  return (
    <For each={store.playlists}>
      {playlist => (
        <div>
          <p style={`background-color: ${playlist.color}`}>
          {playlist.title} - {playlist.songs.length}
          </p>
        </div>
      )}
      </For>
  )
}

function AddPlaylist() {
  return (
    <div>
      <button onClick={updateStore.increment}>
        {store.count}
      </button>
      <input placeholder="Playlist Title" onInput={updateStore.setTitle}/>
      <input type="color" onInput={updateStore.setColor}/>
      <p>{store.title}</p>
      <p>{store.color}</p>
      <button onClick={updateStore.addPlaylist}>
        Add Playlist
      </button>
    </div>
  )
}

function ShowSongs() {
  return (
    <For each={songs}>
    {(song, index) => (
      <div>
        {song.title}
        <button onClick={() => updateStore.setSongId(index())}>Add To Playlist</button>
        <Show when={store.songId == index()}> 
          <For each={store.playlists}>
            {(playlist, pIndex) => (
              <button onClick={() => updateStore.addSongToPlaylist(pIndex())}>{playlist.title}</button>
            )} 
          </For>
        </Show>
      </div>
      
    )}
    </For>
  )
}

function Counter() {


  return (
    <div>
      <AddPlaylist/>
      <ShowPlaylist/>
      <ShowSongs/>
    </div>
  );
}

render(() => <Counter />, document.getElementById("app")!);

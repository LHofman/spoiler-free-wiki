import './App.css'
import Slider from './components/Slider';
import PageDetails from './components/PageDetails';

function App() {
  return (
    <>
      <Slider />
      <PageDetails season={0} episode={0} />
    </>
  )
}

export default App

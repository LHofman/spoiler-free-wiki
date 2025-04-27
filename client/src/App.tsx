import axios from 'axios';
import { useState, useEffect } from 'react'
import './App.css'

interface Task {
  _id: string;
  title: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(`http://localhost:3000/api/pages`);
        console.log("Fetched tasks:", response.data); // Debugging log
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <>
      <div>
        { tasks.map((task) => (
          <p>{ task.title }</p>
        )) }
      </div>
    </>
  )
}

export default App

import React, { useEffect, useState } from "react";

type Postr = {
    userId: number,
    id: number,
    title: string,
    completed: boolean
}
export const Search = () => {
    

    const [task, setTask] = useState<Postr[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    

    useEffect(() => {
        setIsLoading(true); 
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then((data: Postr[]) => {
                setTask(data.slice(0, 5));
                setIsLoading(false); 
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false); 
            });
    }, []);

    const handleAddButtonClick= ()=>{
        setIsLoading(true); 
        const newTask: Postr = {
            userId: Math.floor(Math.random() * 1000),
            id: Math.floor(Math.random() * 1000),
            title: inputValue,
            completed: false
        };
        fetch('https://jsonplaceholder.typicode.com/todos',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body:JSON.stringify(newTask)
        }
        
        )
            .then(response => response.json())
            .then((data: Postr[]) => {
                setTask([newTask, ...task]);
                setInputValue('');
        
                
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000); 
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false); 
            });
            
    } 

    const handleCheckboxClick = (i: number) => {
        const updatedTask = [...task];
        updatedTask[i].completed = !updatedTask[i].completed;
        setTask(updatedTask);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]+$/.test(value)) {
            setInputValue(value);
        }
    };

    const handleDeleteButtonClick = (index: number) => {
        setIsLoading(true); 
        fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'DELETE',
        });
        const updatedTask = [...task];
        updatedTask.splice(index, 1);
        
        
        setTimeout(() => {
            setTask(updatedTask);
            setIsLoading(false); 
        }, 1000); 
    };
    const handlePatchButtonClick = (taskId: number, updatedTitle: string) => {
        setIsLoading(true);
        fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: updatedTitle })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update task');
                }
                return response.json();
            })
            .then((data: Postr) => {
                const updatedTasks = task.map(t =>
                    t.id === taskId ? { ...t, title: updatedTitle } : t
                );
                setTask(updatedTasks);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error updating task:', error);
                setIsLoading(false);
            });
    };
    
    return (
        <div className="search-box">
            <header><h1>YUVI's Todo List</h1></header>
            <div className="text-box">
                <input 
                    type="text" 
                    placeholder="Enter the task..." 
                    value={inputValue} 
                    onChange={handleInputChange} 
                />
                <button className="add" onClick={handleAddButtonClick}>ADD</button>
            </div>

            <div className="content">
            {isLoading ? ( 
                    <div className="loader">Loading...</div>
                ) : (
                <table>
                    <tbody>
                        {task.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={item.completed} 
                                        onChange={() => handleCheckboxClick(index)} 
                                    />
                                </td>
                                <td style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                                    {item.title}
                                </td>
                                <td>
                                <button onClick={() => handlePatchButtonClick(item.id, item.title)}>Edit</button>
                                    <button onClick={()=> handleDeleteButtonClick(index)}>delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>)
            }
            </div>
        </div>
    );
}

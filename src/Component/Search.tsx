import React, { useEffect, useState } from "react";

export const Search = () => {
    type Post = {
        userId: number,
        id: number,
        title: string,
        completed: boolean
    }

    const [task, setTask] = useState<Post[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); 

    useEffect(() => {
        setIsLoading(true); 
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then((data: Post[]) => {
                setTask(data.slice(0, 5));
                setIsLoading(false); 
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false); 
            });
    }, []);

    const handleCheckboxClick = (i: number) => {
        const updatedTask = [...task];
        updatedTask[i].completed = !updatedTask[i].completed;
        setTask(updatedTask);
    };

    const handleDeleteButtonClick = (index: number) => {
        setIsLoading(true); 
        const updatedTask = [...task];
        updatedTask.splice(index, 1);
        
        
        setTimeout(() => {
            setTask(updatedTask);
            setIsLoading(false); 
        }, 1000); 
    };
    

    const handleAddButtonClick = () => {
        if (inputValue.trim() !== '') {
            setIsLoading(true); 
            const newTask: Post = {
                userId: Math.floor(Math.random() * 1000),
                id: Math.floor(Math.random() * 1000),
                title: inputValue,
                completed: false
            };
            
            setTask([newTask, ...task]);
            setInputValue('');
    
            
            setTimeout(() => {
                setIsLoading(false);
            }, 1000); 
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]+$/.test(value) || value === '') {
            setInputValue(value);
        }
    };

    return (
        <div className="search-box">
            <header><h1>YUVI's Todo List</h1></header>
            <div className="text-box">
                <input 
                    type="text" 
                    placeholder="Enter the task..." 
                    pattern="[A-Za-z\s]+"
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
                                    <button onClick={() => handleDeleteButtonClick(index)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}
            </div>
        </div>
    );
}

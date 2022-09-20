import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

//Persisting app data
const getLocalStorage = () => {
	let list = localStorage.getItem('list');
	if (list) {
		return JSON.parse(localStorage.getItem('list'));
	} else {
		return [];
	}
};

function App() {
	const [name, setName] = useState('');
	const [list, setList] = useState(getLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
	const [editID, setEditID] = useState(null);
	const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

	const handleSubmit = e => {
		e.preventDefault();
		if (!name) {
			//display alert
			showAlert(true, 'danger', 'Pls enter your todo item first');
			//deal with edit
		} else if (name && isEditing) {
			setList(
				list.map(item => {
					if (item.id === editID) {
						return { ...item, title: name };
					}
					return item;
				}),
			);
			//Reset state values
			setName('');
			setEditID(null);
			setIsEditing(false);
			showAlert(true, 'success', 'Value changed');
		} else {
			showAlert(true, 'success', 'an Item added');
			const newItem = { id: new Date().getTime().toString(), title: name };
			setList([...list, newItem]);
			setName('');
		}
	};

	const showAlert = (show = false, type = '', msg = '') => {
		setAlert({ show, type, msg });
	};
	//App functionalities

	const clearList = () => {
		showAlert(true, 'danger', 'empty list');
		setList([]);
	};

	const removeItem = id => {
		showAlert(true, 'danger', 'item removed');
		setList(list.filter(item => item.id !== id));
	};

	const editItem = id => {
		const specificItem = list.find(item => item.id === id);
		setIsEditing(true);
		setEditID(id);
		setName(specificItem.title);
	};
	useEffect(() => {
		localStorage.setItem('list', JSON.stringify(list));
	}, [list]);

	return (
		<section className='section-center'>
			<form
				className='todo-form'
				onSubmit={handleSubmit}
			>
				{alert.show && (
					<Alert
						{...alert}
						removeAlert={showAlert}
					/>
				)}
				<h3>todo List app</h3>
				<div className='form-control'>
					<input
						type='text'
						className='todo'
						placeholder='e.g go gym'
						value={name}
						onChange={e => setName(e.target.value)}
					/>
					<button
						type='submit'
						className='submit-btn'
					>
						{isEditing ? 'Edit' : 'Add'}
					</button>
				</div>
			</form>
			{list.length > 0 && (
				<div className='todo-container'>
					<List
						items={list}
						removeItem={removeItem}
						list={list}
						editItem={editItem}
					/>
					<button
						className='clear-btn'
						onClick={clearList}
					>
						clear items
					</button>
				</div>
			)}
		</section>
	);
}

export default App;

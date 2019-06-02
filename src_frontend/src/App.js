import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { fetchPersons, insertPerson, updatePerson, deletePerson } from './Model'

const Notification = ({ notif }) => {
  if (notif === null) {
    return null
  }

  const { type, message } = notif

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const FilterSearch = ({ searchField, doSearch }) => (
  <>
    filter shown with <input value={searchField} onChange={doSearch} />
  </>
)

const AddForm = ({ addPerson, newName, setNewName, newNumber, setNewNumber }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /><br />
      number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const PersonList = ({ persons, filter, deleteFactory }) => (
  <>
    { persons
      .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      .map(person => <p key={person.id}>{person.name}: {person.number} <button type="button" onClick={deleteFactory(person)}>delete</button></p>) }
  </>
)

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchField, setSearchField ] = useState('')
  const [ message, setMessage ] = useState(null)

  const fetchAndUpdate = () => {
    fetchPersons(setPersons, err => displayMessage('message-error', 'Cannot fetch persons'))
  };

  const displayMessage = (type, message) => {
    setMessage({type: type, message: message})
    setTimeout(() => setMessage(null), 5000)
  }

  const doSearch = event => {
    setSearchField(event.target.value)
  }

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = {...existingPerson, number: newNumber}
        updatePerson(newPerson, data => {
          setPersons(persons.map(p => p.id === existingPerson.id ? data : p))
          setNewName('')
          setNewNumber('')
          displayMessage('message-success', `Updated ${data.name}`)
        }, err => {
          displayMessage('message-error', `${existingPerson.name} was not found`)
          fetchAndUpdate()
        })
      }
      return
    }

    const newPerson = {name: newName, number: newNumber}
    insertPerson(newPerson, data => {
      setPersons(persons.concat(data))
      setNewName('')
      setNewNumber('')
      displayMessage('message-success', `Added ${data.name}`)
    }, err => {
      displayMessage('message-error', `${newPerson.name} could not be added`)
      fetchAndUpdate()
    })
  }

  const deleteFactory = (person) => {
    return (e) => {
      if (window.confirm(`Delete ${person.name}?`)) {
        deletePerson(person, data => {
          setPersons(persons.filter(p => p.id !== person.id))
          displayMessage('message-success', `Deleted ${person.name}`)
        }, err => {
          displayMessage('message-error', `${person.name} already deleted`)
          fetchAndUpdate()
        })
      }
    }
  }

  useEffect(fetchAndUpdate, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notif={message} />
      <FilterSearch searchField={searchField} doSearch={doSearch} />
      <h3>add a new</h3>
      <AddForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h3>Numbers</h3>
      <PersonList persons={persons} filter={searchField} deleteFactory={deleteFactory} />
    </div>
  )

}

export default App
import { Request, Response } from 'express';
import * as personService from '../services/personService';

export const getPersons = async (req: Request, res: Response): Promise<void> => {
  try {
    const persons = await personService.getAllPersons();
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching persons' });
  }
};

export const getPerson = async (req: Request, res: Response): Promise<void> => {
  try {
    const person = await personService.getPersonById(parseInt(req.params.id));
    if (!person) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching person' });
  }
};

export const createPerson = async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;
  try {
    const newPerson = await personService.createPerson(name, email);
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(500).json({ error: 'Error creating person' });
  }
};

export const updatePerson = async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;
  try {
    const updatedPerson = await personService.updatePerson(
      parseInt(req.params.id),
      name,
      email
    );
    if (!updatedPerson) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }
    res.status(200).json(updatedPerson);
  } catch (error) {
    res.status(500).json({ error: 'Error updating person' });
  }
};

export const deletePerson = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await personService.deletePerson(parseInt(req.params.id));
    if (!success) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }
    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting person' });
  }
};

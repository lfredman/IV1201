import * as personModel from '../models/personModel';

export const getAllPersons = async () => {
  return await personModel.getAllPersons();
};

export const getPersonById = async (id: number) => {
console.log(id);
  return await personModel.getPersonById(id);
};

export const createPerson = async (
  name: string, 
  surname: string,
  pnr: string,
  username: string,
  email: string,
  password: string) => {
  return await personModel.createPerson(name, surname, pnr, username, email, password);
};

export const updatePerson = async (id: number, name: string, email: string) => {
  return await personModel.updatePerson(id, name, email);
};

export const deletePerson = async (id: number) => {
  return await personModel.deletePerson(id);
};
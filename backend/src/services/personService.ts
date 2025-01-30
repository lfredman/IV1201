import * as personModel from '../models/personModel';

export const getAllPersons = async () => {
  return await personModel.getAllPersons();
};

export const getPersonById = async (id: number) => {
console.log(id);
  return await personModel.getPersonById(id);
};

export const createPerson = async (name: string, email: string) => {
  return await personModel.createPerson(name, email);
};

export const updatePerson = async (id: number, name: string, email: string) => {
  return await personModel.updatePerson(id, name, email);
};

export const deletePerson = async (id: number) => {
  return await personModel.deletePerson(id);
};
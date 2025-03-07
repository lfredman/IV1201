/*
    RUN THE FOLLOWING QUERY AND COPY & PASTE THE RESULT TO "competenceOptions"
    SELECT json_agg(row_to_json(competence)) FROM competence; 
*/
const competenceOptions = [
    { "competence_id": 1, "name": "ticket sales" },
    { "competence_id": 2, "name": "lotteries" },
    { "competence_id": 3, "name": "roller coaster operation" }
]

export default competenceOptions;
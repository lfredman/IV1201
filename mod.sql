CREATE TABLE applicant (
    applicant_id SERIAL PRIMARY KEY,
    person_id INTEGER UNIQUE NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'unhandled',
    CONSTRAINT chk_status CHECK (status IN ('unhandled', 'accepted', 'rejected')),
    CONSTRAINT fk_person FOREIGN KEY (person_id) REFERENCES person(person_id) ON DELETE CASCADE
);
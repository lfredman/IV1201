import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom'; // Add this import

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

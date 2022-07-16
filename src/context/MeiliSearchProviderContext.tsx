import { createContext } from "react";
import { MeilisearchContext } from '../types';

export default createContext<MeilisearchContext>({
    client: null
})
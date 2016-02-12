import nock from "nock";
import { API_BASE_URL } from "../../src/Config";

export default function() {
    return nock(API_BASE_URL);
}
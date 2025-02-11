import { Show } from './show.entity';

//-------------------------------------------------------------------------
// findAll
//-------------------------------------------------------------------------
export interface ShowServiceFindAllInput {}

export interface ShowServiceFindAllOutput {
  shows: Show[];
}

//-------------------------------------------------------------------------
// findOne
//-------------------------------------------------------------------------

export interface ShowServiceFindOneInput {
  id: string;
}

export interface ShowServiceFindOneOutput {
  show: Show;
}

//-------------------------------------------------------------------------
// remove
//-------------------------------------------------------------------------

export interface ShowServiceRemoveInput {
  id: string;
}

export type ShowServiceRemoveOutput = void;

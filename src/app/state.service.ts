import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface AppState {
  isAuthenticated: boolean;
  user: { id: number; name: string; role: string } | null;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private initialState: AppState = {
    isAuthenticated: false,
    user: null,
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);

  constructor() { }

  getState(): Observable<AppState> {
    return this.stateSubject.asObservable();
  }

  // Get the current state value
  getStateValue(): AppState {
    return this.stateSubject.getValue();
  }

  // Update the state
  setState(newState: Partial<AppState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }

  // Reset the state to initial
  resetState() {
    this.stateSubject.next(this.initialState);
  }
}

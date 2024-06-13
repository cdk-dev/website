'use client'

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function LoggedInLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator>
      {({ user, signOut }) => (
        <>
          <nav>
            <ul>
              <li>
                <a href="#" onClick={signOut}>Logout</a>
              </li>
            </ul>
          </nav>
          {children}
        </>
      )}
    </Authenticator>
  );
}
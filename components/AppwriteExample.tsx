import React, { useEffect, useState } from 'react';
import { Account } from 'appwrite';
import client from '../lib/appwrite';

const AppwriteExample: React.FC = () => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const account = new Account(client);
        
        const checkSession = async () => {
            try {
                const session = await account.get();
                setUser(session.name);
            } catch (error) {
                console.error('Uživatel není přihlášen', error);
                setUser(null);
            }
        };

        checkSession();
    }, []);

    return (
        <div>
            <h2>Appwrite Příklad</h2>
            {user ? (
                <p>Přihlášený uživatel: {user}</p>
            ) : (
                <p>Uživatel není přihlášen</p>
            )}
        </div>
    );
};

export default AppwriteExample;
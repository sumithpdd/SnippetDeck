# Junior Developer Guide - SnippetDeck 🧑‍💻

Welcome to the **SnippetDeck Pro** project! This guide explains the code structure and how you can take it to the next level.

## 📁 Project Structure Explained

- **`public/manifest.json`**: This is the heart of any Chrome extension. It tells Chrome what name to show, what icons to use, and which file is the "popup" (the window that opens when you click the extension icon).
- **`src/types.ts`**: We use TypeScript interfaces to define what a `Snippet` looks like. This prevents bugs by ensuring everyone knows exactly what data exists.
- **`src/App.tsx`**: The main logic. It handles the list of snippets, the search, and the "filtering" logic.
- **`src/index.css`**: All the styling is here using **CSS Variables**. You can change the theme by just updating the colors at the top!

## 🚀 How to Add a Feature

1.  **Add a new Category:** Go to `types.ts` and add a new string to the `CATEGORIES` array. It will automatically show up in the filter!
2.  **Add a custom field:** Update the `Snippet` interface in `types.ts` (e.g., add `notes: string;`) and then update the form in `App.tsx`.

## 🔥 Preparing for Firebase Integration

The project currently uses `MOCK_DATA`. To move to Firebase, follow these steps:

1.  **Install Firebase:** Run `npm install firebase`.
2.  **Create a Firebase Config:** Create a `src/firebase.ts` file and paste your config from the Firebase Console.
3.  **Replace Mock with State:** In `App.tsx`, instead of initializing `snippets` with `MOCK_DATA`, use an empty array `[]`.
4.  **Use `useEffect`:** Use the `onSnapshot` function from Firestore to listen to the snippets collection.
    ```typescript
    useEffect(() => {
      const unsub = onSnapshot(collection(db, "snippets"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setSnippets(data);
      });
      return () => unsub();
    }, []);
    ```

## 🛠️ Debugging Tips

1.  Right-click the extension icon and select **Inspect Popup**.
2.  This opens the standard Chrome DevTools (Console, Elements, Network) just for your extension!

Have fun building! If you have questions, look at the `lucide-react` documentation for more icons.

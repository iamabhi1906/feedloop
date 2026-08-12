import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import authReducer from "@/src/features/auth/auth.slice";
// import recipeReducer from "@/src/features/recipes/recipe.slice";
// import categoryReducer from "@/src/features/categories/category.slice";
// import ingredientReducer from "@/src/features/ingredients/ingredient.slice";
// import favoriteReducer from "@/src/features/favorites/favorite.slice";
// import uploadReducer from "@/src/features/uploads/upload.slice";

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // recipes: recipeReducer,
    // categories: categoryReducer,
    // ingredients: ingredientReducer,
    // favorites: favoriteReducer,
    // uploads: uploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

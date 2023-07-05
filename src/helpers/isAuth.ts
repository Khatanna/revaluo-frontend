export async function isAuth(
  API_URL: string,
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const token = document.cookie.split(";").at(-1) as string;
  const response = await fetch(`${API_URL}/isAuth`, {
    method: "POST",
    headers: {
      authorization: token,
    },
  });

  const { isAuth } = await response.json();

  setIsAuth(isAuth);
}

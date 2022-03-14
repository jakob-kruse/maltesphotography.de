import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const allowedUserIds: string[] = (process.env.GITHUB_ALLOWED_USER_IDS || '')
  .split(',')
  .map((u) => u.trim());

export default NextAuth({
  callbacks: {
    signIn(params) {
      const userId = params.user.id.toString();
      const isAllowedUser =
        userId !== undefined && allowedUserIds.includes(userId);

      if (!isAllowedUser) {
        console.log(
          `User ${params.profile.login} with ID ${params.profile.id} is not allowed to sign in`
        );
      }

      return isAllowedUser;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});

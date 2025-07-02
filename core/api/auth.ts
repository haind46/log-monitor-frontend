import ProxyBase from '../proxy-base'

const UserProxy = new ProxyBase()

type LoginUserType = {
    username: string
    password: string
  }
  
  export const login = ({
    username,
    password,
  }: LoginUserType) => {
    return UserProxy.post({
      requestConfig: {
        url: '/api/auth/login', 
        data: {
          username,
          password,
        },
      },
    });
  };

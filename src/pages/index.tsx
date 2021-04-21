//SPA - chamadas a api fazendo uso do useEffect
//SSR
//SSG
import { GetStaticProps } from "next";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
type Episode = {
  id:string ,
  title:string ,
  thumbnail:string ,
  members:string ,
  publishedAt:string ,  
  duration: number,
  durationAsString:string,
  description:string ,
  url:string,
};

type HomeProps = {
  episodes: Array<Episode>; //pode ser usado tbm Episode[];
};

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1> index </h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get(`episodes`, {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }), // publishedAt come from the api as published_at
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  });

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  };
};

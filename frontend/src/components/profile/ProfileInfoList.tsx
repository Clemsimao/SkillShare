// composant qui affiche une liste d'informations de profil  
export default function ProfileInfoList(props: {
    fullname: string;
    age: number | string;
    gender: string;
    city: string;
})  {
 const { fullname, age, gender, city } = props;
// Sous-composant Row pour éviter la répétition de code 
   const Row = ({ label, value }: { label: string; value: string | number }) => (
    // Ce div est stylisé comme un bouton pour des raisons de design.
    <div className="btn btn-sm btn-outline w-full justify-between">
      <span>{label}</span>
      <span className="opacity-80">{value}</span>
    </div>
  );

// Rendu final du composant.
  return (
    // Section principale contenant les lignes d'informations
    <section className="space-y-2">
      {/* Ligne statique qui affiche le pseudo */}
      <div className="btn w-full cursor-default">Pseudo</div>

      {/* Chaque ligne d'information utilise le sous-composant Row */}
      <Row label="Nom / Prénom" value={fullname} />
      <Row label="Âge" value={age} />
      <Row label="Sexe" value={gender} />
      <Row label="Localisation" value={city} />
    </section>
  );
}


 
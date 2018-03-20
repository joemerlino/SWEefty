<?php
/*
* Autore: InfiniTech
* Data creazione: 2015-04-12
* E-mail: info.infinitech@gmail.com
*
* Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto licenza MIT.
*
* Diario delle modifiche:
* 2016-04-02 - Adattamento script alla struttura del repository del team Beacon Strips
* 				Viviana Alessio
* 2015-05-13 - Aggiunta deglossarizzazione delle $linesToIgnore - Enrico Ceron
* 2015-04-18 - Creazione dello script - Enrico Ceron
*
*
* 2016-12-12 - adattamento dello script al gruppo Co.Code, Mattia Bottaro
* 2016-12-17 - pesanti modifiche effettuate da Mattia Bottaro del gruppo Co.Code(formatosi
  per il progetto di SWE dell'uniPD) -> UPDATE alla versione 2.0 by Mattia Bottaro
  Nelle versioni 1.x lo script funzionava solo per un file, dato in input. Quindi per
  glossarizzare n files bisognava eseguire n volte lo script.
  Ora, in base alla organizzazione del repository di Co.Code, lo script cerca tutti i file .tex
  e li glossarizza.
  2017-03-04 Ora lo script glossarizza solo la prima occorrenza di ogni parola. Inoltre permette la deglossarizzazione.
  Lo script ora può essere eseguito in ambienti diversi da Linux. -> UPDATE alla versione 3.0 by Mattia Bottaro
  Per Glossarizzare, dare da terminale php glossarize2.php
  Per Deglossarizzare, dare php glossarize2.php -d
  2017-12-20 - adattamento dello script al gruppo SWEefty, Giuseppe Merlino
*/


// eseguire lo script direttamente all'interno della cartella "script"

error_reporting(E_ERROR | E_PARSE); // non vengono stampati i warning

$rev = ('../RR/'); //al cambio di revisione modificare questa variabile
$revisione = 'Revisione dei REQUISITI';//e questa
$glossarizzato=false;

$docs = array(
  /*'Glo' => 'Glossario/sezioni/',*/
  'NdP' => 'NormeDiProgetto/',
  'PdP' => 'PianoDiProgetto/',
  'AdR' => 'AnalisiDeiRequisiti/',
  'SdF' => 'StudioDiFattibilita/',
  'PdQ' => 'PianoDiQualifica/'/*,
  'DdP' => 'DefinizioneDiProdotto/'
  //'LdP' => 'LetteraDiPresentazione/'*/
);
echo <<< EOF

###  Software sotto licenza MIT ###

______                            _
|  __ \ | by Enrico Ceron        (_) v1.1
| |  \/ | ___  ___ ___  __ _ _ __ _ _______
| | __| |/ _ \/ __/ __|/ _' | '__| |_  / _ \
| |_\ \ | (_) \__ \__ \ (_| | |  | |/ /  __/
 \____/_|\___/|___/___/\__,_|_|  |_/___\___|

  Improved by Mattia Bottaro     v3.0
  Adapted  by joemerlino         v3.1

EOF;

echo <<< EOF
+-----------------------+---------------------+
 $revisione
+-----------------------+---------------------+
|       Documento       |        Esito        |
+-----------------------+---------------------+

EOF;

function glossarizeDoc($path) {
  //$var_dump($argv);
  if (isset($path)) {
    $docSign = $path;  /*
    if (file_exists($docSign)) {
      echo "È stato scelto di glossarizzare il documento <" . $path . ">...\n\n";
    } else {
      echo "File inesistente! Glossarizzazione abortita.\n";
      exit;
    }
    */
  }

  /**
   * Apertura del documento e dell'elenco delle voci di glossario
   */
  $filename = $path;
  $voci = fopen('terminiGlossario.txt', 'r');

  /**
   * Regex delle righe da ignorare. Sono ignorati i titoli di sezioni
   * e sotto-sezioni, paragrafi e sotto-paragrafi, etichette e riferimenti,
   * didascalie, URL e testo preformattato.
   */
   $linesToIgnore = "/^((\\\section)|(\\\subsection)|(\\\subsubsection)|(\\\parola)|(\\\url)|(\\\modifica)|" .
                    "(\\\paragraph)|(\\\subparagraph)|(\\\caption)|(\\\url)|(\\\parola)|(\\\modifica)|" .
                    "(.*\\\href)|(\\\includegraphics)|(\\\\texttt)|(\\\parola)|(\\\url)|(\\\modifica)|" .
                    "(\\\\ref)|(\\\label)|(\\\def\\\input@path))/";

  /**
   * Per ogni voce di glossario...
   */
  while (!feof($voci)) {
    $glo_or_deglo=$_SERVER[ "argv" ][1];
    $voce =trim(fgets($voci));
    $filesections = fopen($filename, 'r');  //APRE SEZIONI TEX
    $trovato = false;
    while (!feof($filesections) && !$trovato) {
      $line = fgets($filesections);
      if (preg_match('/.tex/', $line)) {
        $filepath = substr($filename, 0, -15) . substr($line, 7, -2);
        echo $filepath."\n";
        $file = fopen($filepath, 'r');  //APRE SEZIONI TEX
        $lineNumber = 0;
        rewind($file);/*
        $data = file($file); // reads an array of lines
        function replace_a_line($data) {
           if (preg_match("/\b$voce\b/i", $data) && $voce!="") {
              $trovato = true;
              return preg_replace("/\b$voce\b/i","\gl{".$voce."}",$data,1);
           }
           return $data;
        }
        $data = array_map('replace_a_line',$data);
        file_put_contents('myfile', implode('', $data));
        */
        //cicla ogni file del sezioni.tex
        while (!feof($file) && !$trovato) {

          $line = fgets($file);
          $lineNumber++;
          /**
           * ...e la (de)glossarizza!
           */
           // Alcuni file non dovrebbero essere glossarizzati (tipo quelli che contengono solo tabelle di tracciamento)
          if (preg_match("/\b$voce\b/i", $line) && $voce!="") {
            if (empty(preg_grep($linesToIgnore, explode("\n", $line)))) { // glo
              //echo $line."\n";
              //echo $path." ".$voce."\n";
              //echo $filename."-".$voce."\n";
              if($voce=="casi d'uso" || $voce=="Casi d'uso"){
                $Vvoce=$voce;
                $file_contents = file_get_contents($filename);
                $file_contents = str_replace($Vvoce,"casi duso",$file_contents);
                file_put_contents($filename,$file_contents);
                $voce="casi duso";
              }
              ///* Attivare qui per GLOSSARIZZARE ----

              if($glo_or_deglo!="-d"){
                $trovato = true;
                echo "Glossarizzato: ".$voce." linea: ".$lineNumber."\ncontenuto: ".$line."\n";
                $file_contents = file_get_contents($filepath);
                $file_contents = preg_replace("/\b$voce\b/i","\gl{".$voce."}",$file_contents,1);
                
                //fwrite($file, $file_contents); 
                file_put_contents($filepath, $file_contents);
                //file_put_contents($filename,$file_contents);
              }
              else{
                  $file_contents = file_get_contents($filepath);
                  $file_contents = str_replace("\gl{".$voce."}","$voce",$file_contents);
                  file_put_contents($filepath,$file_contents);
              }
              if($voce=="casi duso"){
                $file_contents = file_get_contents($filename);
                $file_contents = str_replace("casi duso",$Vvoce,$file_contents);
                file_put_contents($filename,$file_contents);
                $voce=$Vvoce;
              }
              if($glo_or_deglo!="-d") break;
            } //else {}
          }
        }
        fclose($file);
      }//if controllo .tex
    }
    fclose($filesections);
  }
  
  fclose($voci);

}

/**
 * Calcola la media dei valori all'interno di un array
 */
function median($array) {
  $sum = 0;
  foreach ($array as $val) {
    $sum += $val;
  }
  return $sum/sizeof($array);
}


 //echo "Glossarizzazione di: \n";
foreach ($docs as $doc => $dir) {
    echo $rev . $dir . "Res/Sezioni.tex\n";
    glossarizeDoc($rev . $root . $dir . "Res/Sezioni.tex");
    if($_SERVER[ "argv" ][1]!="-d") $phrases="   Glossarizzato";
    else $phrases="DE-Glossarizzato";
    if(file_exists($rev.$root.$dir)){
      echo "|        $doc            | \033[33;32m $phrases";echo"\e[0m   |   \n";
      echo "+-----------------------+---------------------+\n";
    }else{
      echo "|        $doc            |    \033[33;31m Non esistente";echo"\e[0m   |    \n";
      echo "+-----------------------+---------------------+\n";
    }
}

echo "\n";
echo "\e[0m\nInfiniTech e Co.Code si sollevano da ogni responsabilità.\n";
echo "\n";

?>

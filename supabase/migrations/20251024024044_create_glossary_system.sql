/*
  # Tech Glossary Learning Platform Schema

  ## Overview
  Creates a comprehensive system for managing technology glossary terms and quiz questions
  with bilingual support (English/Spanish).

  ## New Tables

  ### `glossary_categories`
  - `id` (uuid, primary key) - Unique identifier
  - `name_en` (text) - Category name in English
  - `name_es` (text) - Category name in Spanish
  - `slug` (text, unique) - URL-friendly identifier
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp

  ### `glossary_terms`
  - `id` (uuid, primary key) - Unique identifier
  - `category_id` (uuid, foreign key) - Reference to category
  - `term_en` (text) - Term in English
  - `term_es` (text) - Term in Spanish
  - `definition_en` (text) - Definition in English
  - `definition_es` (text) - Definition in Spanish
  - `example_en` (text) - Real-world example in English
  - `example_es` (text) - Real-world example in Spanish
  - `created_at` (timestamptz) - Creation timestamp

  ### `quiz_questions`
  - `id` (uuid, primary key) - Unique identifier
  - `category_id` (uuid, foreign key) - Reference to category
  - `question_en` (text) - Question in English
  - `question_es` (text) - Question in Spanish
  - `options_en` (jsonb) - Array of options in English
  - `options_es` (jsonb) - Array of options in Spanish
  - `correct_answer` (integer) - Index of correct answer (0-3)
  - `explanation_en` (text) - Explanation in English
  - `explanation_es` (text) - Explanation in Spanish
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access (educational content)
  - Restrict write operations to authenticated users

  ## Notes
  1. All content is bilingual for English/Spanish support
  2. Categories have order_index for logical progression
  3. Quiz questions support 4 options with explanations
  4. Public read access enables open learning
*/

-- Create glossary_categories table
CREATE TABLE IF NOT EXISTS glossary_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_es text NOT NULL,
  slug text UNIQUE NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create glossary_terms table
CREATE TABLE IF NOT EXISTS glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES glossary_categories(id) ON DELETE CASCADE NOT NULL,
  term_en text NOT NULL,
  term_es text NOT NULL,
  definition_en text NOT NULL,
  definition_es text NOT NULL,
  example_en text NOT NULL,
  example_es text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES glossary_categories(id) ON DELETE CASCADE NOT NULL,
  question_en text NOT NULL,
  question_es text NOT NULL,
  options_en jsonb NOT NULL,
  options_es jsonb NOT NULL,
  correct_answer integer NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation_en text NOT NULL,
  explanation_es text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE glossary_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view categories"
  ON glossary_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view terms"
  ON glossary_terms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO public
  USING (true);

-- Insert sample categories
INSERT INTO glossary_categories (name_en, name_es, slug, order_index) VALUES
  ('Networking Fundamentals', 'Fundamentos de Redes', 'networking', 1),
  ('Cloud Computing', 'Computación en la Nube', 'cloud', 2),
  ('Scripting & Automation', 'Scripting y Automatización', 'scripting', 3),
  ('Computer Systems', 'Sistemas Computacionales', 'systems', 4);

-- Insert sample networking terms
INSERT INTO glossary_terms (category_id, term_en, term_es, definition_en, definition_es, example_en, example_es)
SELECT 
  id,
  'IP Address',
  'Dirección IP',
  'A unique numerical label assigned to each device connected to a network. Think of it as a digital home address that lets devices find and communicate with each other.',
  'Una etiqueta numérica única asignada a cada dispositivo conectado a una red. Piénsalo como una dirección postal digital que permite a los dispositivos encontrarse y comunicarse entre sí.',
  'When you connect your phone to WiFi, it gets an IP address like 192.168.1.15. This is how the router knows where to send your Netflix stream.',
  'Cuando conectas tu teléfono al WiFi, obtiene una dirección IP como 192.168.1.15. Así es como el router sabe dónde enviar tu transmisión de Netflix.'
FROM glossary_categories WHERE slug = 'networking' LIMIT 1;

INSERT INTO glossary_terms (category_id, term_en, term_es, definition_en, definition_es, example_en, example_es)
SELECT 
  id,
  'DNS (Domain Name System)',
  'DNS (Sistema de Nombres de Dominio)',
  'A system that translates human-readable domain names (like google.com) into IP addresses that computers use. It''s like a phonebook for the internet.',
  'Un sistema que traduce nombres de dominio legibles (como google.com) en direcciones IP que usan las computadoras. Es como una guía telefónica para internet.',
  'When you type "amazon.com" in your browser, DNS servers translate it to an IP address like 54.239.28.85 so your computer knows where to go.',
  'Cuando escribes "amazon.com" en tu navegador, los servidores DNS lo traducen a una dirección IP como 54.239.28.85 para que tu computadora sepa a dónde ir.'
FROM glossary_categories WHERE slug = 'networking' LIMIT 1;

-- Insert sample cloud computing terms
INSERT INTO glossary_terms (category_id, term_en, term_es, definition_en, definition_es, example_en, example_es)
SELECT 
  id,
  'Virtual Machine (VM)',
  'Máquina Virtual (VM)',
  'A software-based computer that runs inside another computer. It acts like a real computer with its own operating system and applications, but shares physical hardware.',
  'Una computadora basada en software que se ejecuta dentro de otra computadora. Actúa como una computadora real con su propio sistema operativo y aplicaciones, pero comparte hardware físico.',
  'Netflix uses thousands of virtual machines in the cloud to stream shows to millions of people simultaneously, scaling up during peak hours and down during quiet times.',
  'Netflix usa miles de máquinas virtuales en la nube para transmitir programas a millones de personas simultáneamente, escalando durante las horas pico y reduciendo durante momentos tranquilos.'
FROM glossary_categories WHERE slug = 'cloud' LIMIT 1;

INSERT INTO glossary_terms (category_id, term_en, term_es, definition_en, definition_es, example_en, example_es)
SELECT 
  id,
  'API (Application Programming Interface)',
  'API (Interfaz de Programación de Aplicaciones)',
  'A set of rules and tools that allows different software applications to communicate with each other. Think of it as a waiter in a restaurant who takes your order to the kitchen and brings back your food.',
  'Un conjunto de reglas y herramientas que permite a diferentes aplicaciones de software comunicarse entre sí. Piénsalo como un mesero en un restaurante que lleva tu orden a la cocina y trae tu comida.',
  'When you use a weather app on your phone, it uses an API to request current weather data from a weather service and displays it to you.',
  'Cuando usas una aplicación del clima en tu teléfono, usa una API para solicitar datos meteorológicos actuales de un servicio del clima y te los muestra.'
FROM glossary_categories WHERE slug = 'cloud' LIMIT 1;

-- Insert sample scripting terms
INSERT INTO glossary_terms (category_id, term_en, term_es, definition_en, definition_es, example_en, example_es)
SELECT 
  id,
  'Bash Script',
  'Script de Bash',
  'A text file containing a series of commands for a Unix/Linux system to execute automatically. It''s like creating a recipe that the computer follows step by step.',
  'Un archivo de texto que contiene una serie de comandos para que un sistema Unix/Linux ejecute automáticamente. Es como crear una receta que la computadora sigue paso a paso.',
  'A system administrator writes a bash script to automatically backup important files every night at 2 AM, saving hours of manual work.',
  'Un administrador de sistemas escribe un script de bash para respaldar automáticamente archivos importantes cada noche a las 2 AM, ahorrando horas de trabajo manual.'
FROM glossary_categories WHERE slug = 'scripting' LIMIT 1;

-- Insert sample systems terms
INSERT INTO glossary_terms (category_id, term_en, term_es, definition_en, definition_es, example_en, example_es)
SELECT 
  id,
  'RAM (Random Access Memory)',
  'RAM (Memoria de Acceso Aleatorio)',
  'Temporary, fast memory that a computer uses to store data it''s currently working with. When you turn off your computer, RAM is cleared. Think of it as a desk workspace.',
  'Memoria temporal y rápida que una computadora usa para almacenar datos con los que está trabajando actualmente. Cuando apagas tu computadora, la RAM se borra. Piénsalo como un escritorio de trabajo.',
  'When you open multiple browser tabs, each one uses RAM. If you open too many, your computer slows down because it runs out of "desk space" to work efficiently.',
  'Cuando abres múltiples pestañas del navegador, cada una usa RAM. Si abres demasiadas, tu computadora se ralentiza porque se queda sin "espacio de escritorio" para trabajar eficientemente.'
FROM glossary_categories WHERE slug = 'systems' LIMIT 1;

-- Insert sample quiz questions
INSERT INTO quiz_questions (category_id, question_en, question_es, options_en, options_es, correct_answer, explanation_en, explanation_es)
SELECT 
  id,
  'What does an IP address do?',
  '¿Qué hace una dirección IP?',
  '["Stores website passwords", "Identifies devices on a network", "Speeds up internet connection", "Protects against viruses"]'::jsonb,
  '["Almacena contraseñas de sitios web", "Identifica dispositivos en una red", "Acelera la conexión a internet", "Protege contra virus"]'::jsonb,
  1,
  'An IP address uniquely identifies each device on a network, allowing them to find and communicate with each other.',
  'Una dirección IP identifica únicamente cada dispositivo en una red, permitiéndoles encontrarse y comunicarse entre sí.'
FROM glossary_categories WHERE slug = 'networking' LIMIT 1;

INSERT INTO quiz_questions (category_id, question_en, question_es, options_en, options_es, correct_answer, explanation_en, explanation_es)
SELECT 
  id,
  'What is the main advantage of using virtual machines in the cloud?',
  '¿Cuál es la principal ventaja de usar máquinas virtuales en la nube?',
  '["They are always free", "They can scale resources up or down as needed", "They never need updates", "They work without internet"]'::jsonb,
  '["Siempre son gratuitas", "Pueden escalar recursos hacia arriba o abajo según sea necesario", "Nunca necesitan actualizaciones", "Funcionan sin internet"]'::jsonb,
  1,
  'Virtual machines can easily scale computing resources based on demand, making them cost-effective and flexible.',
  'Las máquinas virtuales pueden escalar fácilmente los recursos informáticos según la demanda, haciéndolas rentables y flexibles.'
FROM glossary_categories WHERE slug = 'cloud' LIMIT 1;

INSERT INTO quiz_questions (category_id, question_en, question_es, options_en, options_es, correct_answer, explanation_en, explanation_es)
SELECT 
  id,
  'What is a bash script primarily used for?',
  '¿Para qué se usa principalmente un script de bash?',
  '["Creating graphics", "Automating repetitive tasks", "Playing video games", "Browsing the web"]'::jsonb,
  '["Crear gráficos", "Automatizar tareas repetitivas", "Jugar videojuegos", "Navegar por la web"]'::jsonb,
  1,
  'Bash scripts automate command sequences, making repetitive tasks faster and reducing human error.',
  'Los scripts de bash automatizan secuencias de comandos, haciendo las tareas repetitivas más rápidas y reduciendo el error humano.'
FROM glossary_categories WHERE slug = 'scripting' LIMIT 1;

INSERT INTO quiz_questions (category_id, question_en, question_es, options_en, options_es, correct_answer, explanation_en, explanation_es)
SELECT 
  id,
  'What happens to data stored in RAM when you turn off your computer?',
  '¿Qué pasa con los datos almacenados en RAM cuando apagas tu computadora?',
  '["It is saved permanently", "It is deleted", "It moves to the hard drive", "It becomes encrypted"]'::jsonb,
  '["Se guarda permanentemente", "Se borra", "Se mueve al disco duro", "Se encripta"]'::jsonb,
  1,
  'RAM is volatile memory, meaning all data is cleared when power is lost. That''s why you need to save your work!',
  'La RAM es memoria volátil, lo que significa que todos los datos se borran cuando se pierde la energía. ¡Por eso necesitas guardar tu trabajo!'
FROM glossary_categories WHERE slug = 'systems' LIMIT 1;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_glossary_terms_category ON glossary_terms(category_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_order ON glossary_categories(order_index);